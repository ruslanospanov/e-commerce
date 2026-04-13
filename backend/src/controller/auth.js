import authServive from '../services/auth.js';
import asyncHandler from 'express-async-handler';

const register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    const result = await authServive.register(email, password, name);

    res.status(201).json({
        message: 'User registered successfully',
        data: result
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authServive.login(email, password);

    res.status(200).json({
        message: 'User successfully logged in',
        data: result
    });
});

const refreshTokenHandler = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        const error = new Error('Refresh token required');
        error.status = 400;
        throw error;
    }

    const token = await authServive.refreshToken(refreshToken);

    res.status(200).json({
        message: 'Token refreshed',
        data: token
    });
});

const verifyResetToken = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const decoded = authServive.verifyResetToken(token);

    res.status(200).json({
        message: 'Token is valid',
        data: decoded
    });
});

export { register, login, refreshTokenHandler, verifyResetToken };