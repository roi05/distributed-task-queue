import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, stack }) =>
          stack
            ? `${timestamp} [${level}]: ${message}\n${stack}`
            : `${timestamp} [${level}]: ${message}`,
        ),
      ),
    }),
    // new transports.File({
    //   filename: "logs/combined.log",
    //   format: format.json(),
    // }),
    // new transports.File({
    //   filename: "logs/error.log",
    //   level: "error",
    //   format: format.json(),
    // }),
  ],
});

export default logger;
