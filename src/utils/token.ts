import jwt from 'jsonwebtoken';

import { config } from 'config/config';
import { ReturnUser } from 'types';

export const generateAccessToken = async (user: ReturnUser): Promise<string> =>
  jwt.sign({ user }, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiresIn,
  });

export const generateRefreshToken = async (user: ReturnUser): Promise<string> =>
  jwt.sign({ user }, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiresIn,
  });
