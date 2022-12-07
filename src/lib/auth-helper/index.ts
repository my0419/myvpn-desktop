export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type OAuthFlowType = 'code' | 'token' | 'password' | 'client_credentials'

export type OAuthConfigType = {
  response_type?: 'code' | 'token' | 'password' | string
  grant_type?: 'authorization_code' | 'password' | 'client_credentials' | string
  scope?: string
  client_id?: string
  client_secret?: string
  authorize_url?: string
  access_token_url?: string
  redirect_uri?: string
  username?: string
  password?: string
  code?: string
  state?: string
}

export type AuthorizationCodeGrantConfig = Required<
  Pick<
    OAuthConfigType,
    'authorize_url' | 'access_token_url' | 'client_id' | 'redirect_uri'
  >
> &
  Pick<OAuthConfigType, 'state' | 'client_secret'>

export type AccessTokenRequestParameter = {
  // REQUIRED.  Value MUST be set to "authorization_code".
  grant_type: 'authorization_code'

  // REQUIRED.  The authorization code received from the
  // authorization server.
  code: string

  // REQUIRED, if the "redirect_uri" parameter was included in the
  // authorization request as described in Section 4.1.1, and their
  // values MUST be identical.
  redirect_uri: string

  // REQUIRED, if the client is not authenticating with the
  // authorization server as described in Section 3.2.1.
  client_id: string

  client_secret?: string

  state?: string
}

export type ImplicitGrantConfig = Required<
  Pick<OAuthConfigType, 'authorize_url' | 'response_type' | 'client_id' | 'redirect_uri'>
>

export type ResourceOwnerPasswordCredentialsGrantConfig = Required<
  Pick<OAuthConfigType, 'access_token_url' | 'response_type' | 'username' | 'password'>
>

export type ClientCredentialsGrantConfig = Required<
  Pick<OAuthConfigType, 'grant_type' | 'access_token_url'>
>

export class EOHError extends Error {
  public query?: string
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
