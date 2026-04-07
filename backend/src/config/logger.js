import winston from "winston"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename);

const { NODE_ENV, LOG_LEVEL } = process.env;

const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, errors, json, colorize, simple} = winston.format;

const logger = winston.createLogger({
    level: LOG_LEVEL || "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss"}),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: "ecommerce-api" },
    transports: [
        new winston.transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(logsDir, "combined.log") })
    ]
});

if (NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            simple()
        )
    }));
}

export default logger;