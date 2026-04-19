import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class Cart extends Model {}

Cart.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    product_id: {
        type: DataTypes.UUID,
        references: {
            model: 'products',
            key: 'id'
        },
        allowNull: false
    },

    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1
        }
    }
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    indexes: [
        { fields: ['user_id']},
        { fields: ['user_id', 'product_id']}
    ] 
});

export default Cart;