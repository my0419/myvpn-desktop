import Url from 'url'
import querystring from 'querystring'
import Debug from 'debug'
import { awaitRedirect, omit, postRequest, ResponseType } from '../utils'
import {
  OAuthConfigType,
  AuthorizationCodeGrantConfig,
  AccessTokenRequestParameter,
  ClientCredentialsGrantConfig,
  ResourceOwnerPasswordCredentialsGrantConfig,
  ImplicitGrantConfig,
  EOHError,
  OAuthFlowType,
} from '../'
import { BrowserWindow } from 'electron'
import { TaskFunction } from './tasks'
import { OAuth2EmitterType } from '.'
const debug = Debug('eoh:oauth2')

const createAuthorizeParameters = (config: OAuthConfigType) => {
  const keys: (keyof OAuthConfigType)[] = [
    'client_id',
    'redirect_uri',
    'scope',
    'state',
    'response_type',
  ]
  const parameter = Object.assign(
    {},
    keys.reduce((prev, key) => {
      if (typeof config[key] === 'string') {
        prev[key] = config[key]
      }
      return prev
    }, {} as OAuthConfigType),
  )
  return parameter
}

export const authorizationCodeFlowTask: TaskFunction<
  AuthorizationCodeGrantConfig
> = async (
  config: AuthorizationCodeGrantConfig,
  emitter: OAuth2EmitterType,
  window?: BrowserWindow,
): Promise<ResponseType> => {
  if (!window) {
    return Promise.reject(new Error('window is required'))
  }

  const authorizeParameters = createAuthorizeParameters(config)
  emitter.emit('before-authorize-request', authorizeParameters)

  const authorizeUrl = `${config.authorize_url}?${querystring.stringify(
    authorizeParameters,
  )}`
  setImmediate(() => {
    debug('load', authorizeUrl)
    window.loadURL(authorizeUrl)
  })
  debug('start authorizationCodeFlowTask')

  const url = await awaitRedirect(
    config.redirect_uri,
    window.webContents.session.webRequest,
  )
  debug(`redirect url: "${url}"`)
  const query = Url.parse(url, true).query
  if (!query) {
    return Promise.reject(new Error(`invalid response: ${url}`))
  }
  if (query.error) {
    const error = new EOHError(`Error response: ${query.error}`)
    error.query = url
    return Promise.reject(error)
  }
  if (!query.code) {
    return Promise.reject(new Error('missing \'code\' response.'))
  }
  if (config.state && !query.state) {
    return Promise.reject(new Error('missing \'state\' response.'))
  }
  const parameters: AccessTokenRequestParameter = {
    client_id: config.client_id,
    grant_type: 'authorization_code',
    code: query.code as string,
    redirect_uri: config.redirect_uri,
  }
  if (config.client_secret) {
    parameters.client_secret = config.client_secret
  }
  if (query.state) {
    parameters.state = query.state as string
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  emitter.emit('before-access-token-request', parameters, headers)
  const postdata = querystring.stringify(parameters)
  return await postRequest(
    {
      url: config.access_token_url,
      headers,
    },
    postdata,
  )
}

export const implicitFlowTask: TaskFunction<ImplicitGrantConfig> = async (
  config: ImplicitGrantConfig,
  emitter: OAuth2EmitterType,
  window?: BrowserWindow,
): Promise<string> => {
  if (!window) {
    return Promise.reject(new Error('window is required'))
  }

  const authorizeParameters = createAuthorizeParameters(config)
  emitter.emit('before-authorize-request', authorizeParameters)

  const authorizeUrl = `${config.authorize_url}?${querystring.stringify(
    authorizeParameters,
  )}`

  setImmediate(() => {
    window.loadURL(authorizeUrl)
  })

  debug('start implicitFlowTask:', authorizeUrl, config.redirect_uri)
  const url = await awaitRedirect(
    config.redirect_uri,
    window.webContents.session.webRequest,
  )
  debug(`redirect url: "${url}"`)
  const hash = (Url.parse(url, false).hash || '').replace(/^#/, '')
  if (hash.includes('error=')) {
    return Promise.reject(new Error(`Error response: ${hash}`))
  }
  return hash
}

export const resourceOwnerPasswordCredentialsFlowTask: TaskFunction<
  ResourceOwnerPasswordCredentialsGrantConfig
> = (config: ResourceOwnerPasswordCredentialsGrantConfig, emitter: OAuth2EmitterType) => {
  const parameters = omit(config, 'access_token_url')
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  emitter.emit('before-access-token-request', parameters, headers)
  const postdata = querystring.stringify(parameters)

  return postRequest({ url: config.access_token_url, headers }, postdata)
}

export const clientCredentialsFlowTask: TaskFunction<ClientCredentialsGrantConfig> = (
  config: ClientCredentialsGrantConfig,
  emitter: OAuth2EmitterType,
) => {
  const parameters = omit(config, 'access_token_url')
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  emitter.emit('before-access-token-request', parameters, headers)
  const postdata = querystring.stringify(parameters)

  return postRequest({ url: config.access_token_url, headers }, postdata)
}

export const validate = (config: OAuthConfigType) => {
  const type = config.response_type || config.grant_type || 'code'

  const requiredKeys = (() => {
    switch (type as OAuthFlowType) {
      case 'code':
        return ['client_id', 'authorize_url', 'access_token_url', 'redirect_uri']
      case 'token':
        return ['client_id', 'authorize_url', 'redirect_uri']
      case 'password':
        return ['access_token_url', 'username', 'password']
      case 'client_credentials':
        return ['access_token_url']
      default:
        throw new Error(`Unsupported type: ${type}`)
    }
  })() as (keyof OAuthConfigType)[]

  const missing = requiredKeys.find(k => typeof config[k] !== 'string')
  if (missing) {
    return new Error(`${missing} is required for ${type}`)
  }
}

export const needWindowForGrantType = (config: OAuthConfigType) => {
  const type = config.response_type || config.grant_type || 'code'
  switch (type) {
    case 'code':
    case 'token':
      return true
    case 'password':
    case 'client_credentials':
      return false
    default:
      throw new Error(`Unsupported type: ${type}`)
  }
}
