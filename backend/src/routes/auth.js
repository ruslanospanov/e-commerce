import express from 'express';
import {
    register,
    login,
    refreshTokenHandler,
    verifyResetToken
} from '../controller/auth.js'

const router = express.Router()

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokenHandler);
router.post('/verify-reset-token', verifyResetToken);

export default router;