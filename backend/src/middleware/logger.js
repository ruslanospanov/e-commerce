import logger from "../config/logger.js";

const loggerMiddleware = (req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start

        logger.info({
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        });
    });

    next();
};

export default loggerMiddleware;