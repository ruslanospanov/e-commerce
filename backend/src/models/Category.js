import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class Category extends Model {}

Category.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Category name already exist'
        }
    },

    description: DataTypes.TEXT,

    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    icon_url: DataTypes.STRING,
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories'
});

export default Category;