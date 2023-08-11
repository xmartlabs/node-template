export interface Config {
  env: string
  logLevel: string
  port: number
  baseUrl: string
  accessTokenSecret: string
  refreshTokenSecret: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
  emailFrom: string
  smtpUser: string
  smtpPassword: string
  smtpHost: string
  smtpPort: number
  appName: string
}

export interface ErrorInterface {
  httpCode: number
  errorCode: number
  description: string
}
