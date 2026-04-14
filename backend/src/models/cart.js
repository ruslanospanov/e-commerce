import { Model, DataType } from 'sequelize'
import sequelize from '../config/database.js'

class Cart extends Model {}

Cart.init({
    id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    },

    user_id: {
        type: DataType.UUID,
        references: {
            model: 'user',
            key: 'id'
        }
    },

    product_id: {
        type: DataType.UUID,
        references: {
            model: 'products',
            key: 'id'
        },
        allowNull: false
    },

    quantity: {
        type: DataType.INTEGER,
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