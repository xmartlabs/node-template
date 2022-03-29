import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import globalLimiter from './rateLimiter';
import morgan from '../config/morgan';
import Config from '../config/config';

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
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
  app.use(morgan.debugHandler);
};
