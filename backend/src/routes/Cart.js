import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
	getAllCarts,
	addCart,
	updateCart,
	deleteCart,
	deleteAllCarts
} from '../controller/Cart.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllCarts);
router.post('/', addCart);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);
router.delete('/', deleteAllCarts);

export default router;
