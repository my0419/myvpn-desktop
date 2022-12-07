import Debug from 'debug'
import { OAuthConfigType } from '../'
import { BrowserWindow } from 'electron'
import { validate, needWindowForGrantType } from './helper'
import { flowTaskFor } from './tasks'
import { EventEmitter } from 'events'
import { ResponseType } from '../utils'

const debug = Debug('eoh:oauth2')

export interface OAuth2EmitterType {
  emit(event: 'before-authorize-request', parameters: object): boolean
  emit(event: 'before-access-token-request', parameters: object, headers: object): boolean
}

export default interface OAuth2Provider {
  on(
    event: 'before-authorize-request',
    listener: (query: { [key: string]: any }) => void,
  ): this

  on(
    event: 'before-access-token-request',
    listener: (
      parameters: { [key: string]: any },
      headers: { [key: string]: any },
    ) => void,
  ): this
}

export default class OAuth2Provider extends EventEmitter implements OAuth2EmitterType {
  config: OAuthConfigType
  finished: boolean
  userCancelError?: Error

  constructor(config: OAuthConfigType) {
    super()
    const error = validate(config)
    if (error) {
      throw error
    }
    this.config = config
    this.finished = false
  }

  /**
   * Initiate OAuth2 flow.
   *
   * if grant_type is "code" or "token", you need to pass "window" argument.
   * In other cases it is not necessary.
   *
   * @example
   * ```js
   *  const window = new BrowserWindow({
   *    width: 600,
   *    height: 800,
   *    webPreferences: {
   *      nodeIntegration: false // We recommend disabling nodeIntegration for security.
   *      contextIsolation: true // We recommend enabling contextIsolation for security.
   *      // see https://github.com/electron/electron/blob/master/docs/tutorial/security.md
   *    },
   *  })
   *  const provider = new OAuth2Provider(config)
   *  provider.perform(window)
   *    .then(console.log)
   *    .catch(console.error)
   * ```
   *
   */
  async perform(window?: BrowserWindow): Promise<ResponseType | string> {
    const config = this.config

    const task = flowTaskFor(config)

    if (needWindowForGrantType(config)) {
      this.finished = false
      if (!window) {
        return Promise.reject(new Error('window is required.'))
      }

      window.once('show', () => {
        window.once('close', () => {
          if (this.finished === false) {
            this.userCancelError = new Error('User cancelled')
          }
        })
      })
    }

    debug('start OAUTH2')
    const resp = await task(config, this, window)
    this.finished = true
    if (this.userCancelError) {
      debug('User cancelled')
      return Promise.reject(this.userCancelError)
    }
    debug('success', resp)
    return Promise.resolve(resp)
  }
}
