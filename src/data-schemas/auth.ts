import { ZodError, z } from 'zod';

import { CreateUserParams, LoginParams } from 'types';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { formatZodError } from 'utils/validator';

const passwordLength = 10;

const userCreationSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  name: z.string(),
  password: z
    .string()
    .min(passwordLength, { message: "Can't be an empty password" }),
});

export type UserCreationSchema = z.infer<typeof userCreationSchema>;

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(passwordLength, { message: "Can't be an empty password" }),
});

export type UserLoginSchema = z.infer<typeof loginSchema>;

export const validateUserSchema = (user: CreateUserParams) => {
  try {
    userCreationSchema.parse(user);
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
