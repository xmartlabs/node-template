import { createLogger, format, transports } from 'winston';
import { config } from 'config/config';

const { colorize, combine, metadata, timestamp, printf } = format;

// Format ERROR or WARN log levels to be print in red
const customFormat = printf((info: any) => {
  const message = `${info.timestamp} [${info.level}] ${info.message}`;
  if (info.level === 'ERROR' || info.level === 'WARN') {
    return colorize({ level: true }).colorize(
      info.level.toLowerCase(),
      message,
    );
  }

  return message;
});

const changeLevelToUpperCase = format((info: any) => {
  const i = info;
  i.level = i.level.toUpperCase();
  return i;
});

export const appLogger = createLogger({
  level: config.logLevel,
  exitOnError: false,
  format: combine(
    changeLevelToUpperCase(),
    metadata(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    customFormat,
  ),
  transports: [new transports.Console()],
});

export class AccessLogStream {
  logger = appLogger;

  public write(message: string) {
    this.logger.log(config.logLevel, message);
  }
}
