import httpStatus from 'http-status';
import morgan from 'morgan';
import { config } from 'config/config';
import { appLogger } from 'config/logger';

// Morgan custom tokens, used in response formats
morgan.token('local-datetime', () => new Date().toLocaleString());
// TODO: Use error handler message once implemented
morgan.token('message', (_req, res) => res.statusMessage);
const getIpFormat = () =>
  config.env === 'production' ? ':remote-addr - ' : '';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (_req, res) => res.statusCode >= httpStatus.BAD_REQUEST,
  stream: { write: (message) => appLogger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req, res) => res.statusCode < httpStatus.BAD_REQUEST,
  stream: { write: (message) => appLogger.error(message.trim()) },
});

const debugHandler = morgan(
  ':remote-addr - :remote-user :local-datetime ":method :url HTTP/:http-version" :status message: :message :res[content-length] DUR=":response-time ms" ":referrer" ":user-agent"',
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    skip: (_req, _res) => config.logLevel !== 'debug',
    stream: { write: (message) => appLogger.debug(message.trim()) },
  },
);
export const morganHandlers = {
  successHandler,
  errorHandler,
  debugHandler,
};
