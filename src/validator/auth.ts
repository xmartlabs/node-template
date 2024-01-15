import { ZodError, z } from 'zod';

import { CreateUserParams, LoginParams } from 'types';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { formatZodError } from 'utils/validator';

const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  name: z.string(),
  password: z.string().min(1, { message: "Can't be an empty password" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: "Can't be an empty password" }),
});

export const validateUserSchema = (user: CreateUserParams) => {
  try {
    userSchema.parse(user);
  } catch (err) {
    const formattedZodError = formatZodError(err as ZodError);
    throw new ApiError(errors.VALIDATION_ERROR, true, formattedZodError);
  }
};

export const validateLoginSchema = (loginParams: LoginParams) => {
  try {
    loginSchema.parse(loginParams);
  } catch (err) {
    const formattedZodError = formatZodError(err as ZodError);
    throw new ApiError(errors.VALIDATION_ERROR, true, formattedZodError);
  }
};
