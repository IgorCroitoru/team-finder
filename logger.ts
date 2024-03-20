import winston from 'winston'
const { format, transports } = winston;

// Define the log format with colors and timestamps
const logFormat = format.combine(
  //format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info', // Set the log level as needed (info, warn, error, etc.)
  format: logFormat,
  transports: [
    new transports.Console() ,
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

// Example usage:
export default logger;