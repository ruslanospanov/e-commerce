import validate from '../middleware/validation.js';
import Joi from 'joi';
import express from 'express';
import {
    register,
    login,
    refreshTokenHandler,
    verifyResetToken,
    meProfile
} from '../controller/auth.js'
import { authenticate } from '../middleware/auth.js';

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const refreshToken = Joi.object({
    refreshToken: Joi.string().required()
})

const token = Joi.object({
    token: Joi.string().required()
})


const router = express.Router()
router.post('/register',validate(registerSchema), register);
router.post('/login', validate(loginSchema) ,login);
router.post('/refresh', validate(refreshToken), refreshTokenHandler);
router.post('/verify-reset-token', validate(token), verifyResetToken);
router.get('/me', authenticate, meProfile);

export default router;