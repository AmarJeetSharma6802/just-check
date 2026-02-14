import winston from "winston";
import path from "path";

const logDir = "logs";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    
    process.env.NODE_ENV === "development" 
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(), //Logs terminal me show honge.

    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }), //Sirf error logs file me save honge:

    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
}); //Sab logs (info + warn + error) save honge:

export default logger;


// line 13 Development → colored logs
// Production → plain logs (files me readable)

// Transport = logs kis jagah bhejne hain.