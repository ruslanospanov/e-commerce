import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
    logger.error({
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;