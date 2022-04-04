export interface Config {
  env: string
  logLevel: string
  port: number
  baseUrl: string
  accessTokenSecret: string
  refreshTokenSecret: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
}
