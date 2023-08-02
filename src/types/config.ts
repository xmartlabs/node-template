export interface Config {
  env: string
  logLevel: string
  port: number
  baseUrl: string
  accessTokenSecret: string
  refreshTokenSecret: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
  emailClient: string
  emailServiceProviderUserId: string
  emailServiceProviderUserPassword: string
  emailHost: string
  emailPort: number
  appName: string
}

export interface ErrorInterface {
  httpCode: number
  errorCode: number
  description: string
}
