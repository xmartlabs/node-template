import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { applyRateLimit } from 'middlewares/rateLimiter';
import { morganHandlers } from 'config/morgan';
import { errorConverter, errorHandler } from 'middlewares/error';
import { Wrapper } from 'types';

export const preRoutesMiddleware = (app: Application) => {
  // Set security HTTP headers
  app.use(helmet());

  // Parse json request body
  app.use(express.json());

  // Parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // Gzip compression
  app.use(compression());

  // Enable cors
  app.use(cors());

  // Limit requests from same IP
  applyRateLimit(app);

  // Load Morgan handlers
  app.use(morganHandlers.successHandler);
  app.use(morganHandlers.errorHandler);
  app.use(morganHandlers.debugHandler);
};

// Middleware separated to use our error handler when a route is not found
export const postRoutesMiddleware = (app: Application) => {
  // Error handling
  app.use(errorConverter);
  app.use(errorHandler);
};

// Wrap every async route handler
// Passes errors to next function
export const wrapper: Wrapper =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);
