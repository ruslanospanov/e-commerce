import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class OrderItem extends Model {}

OrderItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    references: {
      model: 'orders',
      key: 'id'
    },
    allowNull: false
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
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price_at_purchase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  indexes: [
    { fields: ['order_id'] },
    { fields: ['product_id'] }
  ]
});

export default OrderItem;