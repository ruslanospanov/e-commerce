import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import asyncHandler from 'express-async-handler'

const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        throw new Error('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
});

const authorize = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authenticated');
        }

        if (roles.length && !roles.includes(req.user.role)) {
            res.status(403);
            throw new Error('Insufficient permission');
        }

        next();
    });
};

export { authenticate, authorize };