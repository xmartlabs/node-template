export type PasswordResetCodeRequest = {
  email: string
}

export type ResetPassword = {
  email: string,
  code: string,
  newPassword: string,
}
