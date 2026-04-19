import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Product extends Model {
    hasStock(quantity = 1) {
        return this.stock >= quantity;
    }
}

Product.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name : {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: DataTypes.TEXT,
    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            min: 0
        }
    },

    sku: {
        type: DataTypes.STRING,
        unique: {
            msg: 'SKU already exists'
        }
    },

    category_id: {
        type: DataTypes.UUID,
        references: {
            model: 'categories',
            key: 'id'
        },
        allowNull: false
    },

    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },

    review_count: {
        type: DataTypes.INTEGER,
    image_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
        type: DataTypes.INTEGER,
        defaultValue: []
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    indexes: [
        { fields: ['category_id'] },
        { fields: ['name'] },
        { fields: ['slug'] },
        { fields: ['sku'] }
    ]
});

export default Product;