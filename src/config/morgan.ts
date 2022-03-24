import httpStatus from 'http-status';
import morgan from 'morgan';
import Config from './config';
import logger from './logger';

// Morgan custom tokens, used in response formats
morgan.token('local-datetime', () => new Date().toLocaleString());
// TODO: Use error handler message once implemented
morgan.token('message', (_req, res) => res.statusMessage);
const getIpFormat = () => (Config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (_req, res) => res.statusCode >= httpStatus.BAD_REQUEST,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req, res) => res.statusCode < httpStatus.BAD_REQUEST,
  stream: { write: (message) => logger.error(message.trim()) },
});

const debugHandler = morgan(
  ':remote-addr - :remote-user :local-datetime ":method :url HTTP/:http-version" :status message: :message :res[content-length] DUR=":response-time ms" ":referrer" ":user-agent"',
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    skip: (_req, _res) => Config.logLevel !== 'debug',
    stream: { write: (message) => logger.debug(message.trim()) },
  },
);
export default {
  successHandler,
  errorHandler,
  debugHandler,
};
