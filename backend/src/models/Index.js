import User from './user.js';
import Category from './Category.js';
import Product from './Products.js';
import Cart from './cart.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Review from './Reviews.js';

Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

Cart.belongsTo(User, {foreignKey: 'user_id', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
User.hasMany(Cart, { foreignKey: 'user_id', as: 'cart' });

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });

Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

export { 
    User,
    Category,
    Product,
    Cart,
    Order,
    OrderItem,
    Review
};