import jwt from 'jsonwebtoken'
import  User  from '../models/user.js'
import logger from '../config/logger.js'
import asyncHandler from 'express-async-handler'
import { where } from 'sequelize'

class AuthService {
    generateTokens(userId) {
        const payload = { id: userId}

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d'
        });

        return { accessToken, refreshToken };
    }

    register = asyncHandler(async(email, password, name) => {
        const existingUser = await User.findOne({ where: {email} });

        if (existingUser) {
            const error = new Error('Email already registered');
            error.status = 400;
            throw error;
        }

        const user = await User.create({
            email,
            password_hash: password,
            name
        });

        const { accessToken, refreshToken } = this.generateTokens(user.id);

        logger.info(`User registered ${user.email}`);

        return {
            user: user.toJSON(),
            accessToken,
            refreshToken
        };
    });

    login = asyncHandler(async(email, password) => {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            const error = new Error('Invalid Credentials');
            error.status = 401;
            throw error;
        }

        const isPasswordValid = await user.checkPassword(password);

        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        user.last_login = new Date();;
        await user.save();

        const { accessToken, refreshToken } = this.generateTokens(user.id);

        logger.info(`User logged in with ${user.email}`);

        return {
            user: user.toJSON(),
            accessToken,
            refreshToken
        };
    });

    refreshToken = asyncHandler(async (Token) => {
        const decoded = jwt.verify(Token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        const tokens = this.generateTokens(user.id);

        logger.info(`Token refreshed for user ${user.id}`);

        return tokens;
    });

    verifyResetToken = asyncHandler(async(token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            const err = new Error('Invalid or expired reset token');
            err.status = 400;
            throw err;
        }
    });
}

export default new AuthService();