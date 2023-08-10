export interface RequestResetPasswordCode {
  email: string;
}

export interface RequestResetPassword {
  email: string;
  code: string;
  password: string;
}
