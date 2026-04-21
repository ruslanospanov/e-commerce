import { Cart, Product } from '../models/Index.js';
import asyncHandler from 'express-async-handler';

const cartInclude = [
    {
        association: 'product',
        attributes: ['id', 'name', 'price', 'stock', 'image_urls']
    }
];

const getAllCarts = asyncHandler(async (req, res) => {
    const carts = await Cart.findAll({
        where: { user_id: req.user.id },
        include: cartInclude
    });

    const total = carts.reduce((sum, item) => {
        const price = item.product ? Number(item.product.price) : 0;
        return sum + (price * item.quantity);
    }, 0);

    res.status(200).json({
        items: carts,
        total: total.toFixed(2),
        count: carts.length
    });
});

const addCart = asyncHandler(async (req, res) => {
    const { product_id, quantity = 1 } = req.body;
    const qty = Number(quantity);

    if (!product_id) {
        const error = new Error('product_id is required');
        error.status = 400;
        throw error;
    }

    if (!Number.isInteger(qty) || qty < 1) {
        const error = new Error('Quantity must be a positive integer');
        error.status = 400;
        throw error;
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
    }

    let cartItem = await Cart.findOne({
        where: {
            user_id: req.user.id,
            product_id
        }
    });

    let created = false;

    if (cartItem) {
        const nextQty = cartItem.quantity + qty;
        if (!product.hasStock(nextQty)) {
            const error = new Error('Insufficient stock');
            error.status = 400;
            throw error;
        }

        cartItem.quantity = nextQty;
        await cartItem.save();
    } else {
        if (!product.hasStock(qty)) {
            const error = new Error('Insufficient stock');
            error.status = 400;
            throw error;
        }

        cartItem = await Cart.create({
            user_id: req.user.id,
            product_id,
            quantity: qty
        });

        created = true;
    }

    const item = await Cart.findByPk(cartItem.id, {
        include: cartInclude
    });

    res.status(created ? 201 : 200).json({
        message: created ? 'Item added' : 'Item quantity updated',
        data: item
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const qty = Number(req.body.quantity);

    if (!Number.isInteger(qty) || qty < 1) {
        const error = new Error('Quantity must be at least 1');
        error.status = 400;
        throw error;
    }

    const cartItem = await Cart.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id
        }
    });

    if (!cartItem) {
        const error = new Error('Cart item not found');
        error.status = 404;
        throw error;
    }

    const product = await Product.findByPk(cartItem.product_id);
    if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
    }

    if (!product.hasStock(qty)) {
        const error = new Error('Insufficient stock');
        error.status = 400;
        throw error;
    }

    cartItem.quantity = qty;
    await cartItem.save();

    const item = await Cart.findByPk(cartItem.id, {
        include: cartInclude
    });

    res.status(200).json({
        message: 'Cart updated',
        data: item
    });
});

const deleteCart = asyncHandler(async (req, res) => {
    const deletedRows = await Cart.destroy({
        where: {
            id: req.params.id,
            user_id: req.user.id
        }
    });

    if (!deletedRows) {
        const error = new Error('Cart item not found');
        error.status = 404;
        throw error;
    }

    res.status(200).json({ message: 'Item removed from cart' });
});

const deleteAllCarts = asyncHandler(async (req, res) => {
    await Cart.destroy({
        where: { user_id: req.user.id }
    });

    res.status(200).json({ message: 'Cart cleared' });
});

export { getAllCarts, addCart, updateCart, deleteCart, deleteAllCarts };

