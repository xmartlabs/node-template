import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { globalLimiter } from './rateLimiter';
import { morganHandlers } from '../config/morgan';
import { errorConverter, errorHandler } from './error';

export const applyMiddleware = (app: Application) => {
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
  app.use(globalLimiter);

  // Load Morgan handlers
  app.use(morganHandlers.successHandler);
  app.use(morganHandlers.errorHandler);
  app.use(morganHandlers.debugHandler);

  // Error handling
  app.use(errorConverter);
  app.use(errorHandler);
};
