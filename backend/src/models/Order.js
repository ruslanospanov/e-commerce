import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database.js'

class Order extends Model {}

Order.init({
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
    },
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  stripe_payment_id: DataTypes.STRING,
  stripe_charge_id: DataTypes.STRING,
  shipping_address: DataTypes.JSONB,
  billing_address: DataTypes.JSONB,
  tracking_number: DataTypes.STRING,
  notes: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

export default Order;