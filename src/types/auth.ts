export type ReturnAuth = {
  accessToken: string;
  refreshToken: string;
};

export type ReturnAuthService = {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
};

export type LoginParams = { email: string; password: string };

export type RefreshTokenParams = { refreshToken: string };
