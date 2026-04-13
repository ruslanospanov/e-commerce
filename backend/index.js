import "dotenv/config"
import app from "./src/app.js"
import logger from "./src/config/logger.js";

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    logger.info(`The server is running on ${port}`);
})

process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});