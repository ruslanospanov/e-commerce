import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Review extends Model {}

Review.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.UUID,
    references: {
      model: 'products',
      key: 'id'
    },
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    },
    allowNull: false
  },
  order_id: {
    type: DataTypes.UUID,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: DataTypes.STRING,
  comment: DataTypes.TEXT,
  is_verified_purchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  indexes: [
    { fields: ['product_id'] },
    { fields: ['user_id'] }
  ]
});

export default Review;