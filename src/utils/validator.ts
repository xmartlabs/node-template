import { ZodError } from 'zod';

export const formatZodError = (zodError: ZodError) => {
  const formattedError = zodError.errors.map((error) => {
    return {
      field: error.path,
      error: error.message,
    };
  });
  return formattedError;
};
