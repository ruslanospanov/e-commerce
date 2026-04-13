import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcryptjs";

class User extends Model {
    async checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    toJSON() {
        const value = Object.assign({}, this.get());
        delete value.password_hash;
        return value;
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Email already registered'
        },
        validate: {
            isEmail: {
                msg: 'Invalid email format'
            }
        }    
    },

    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone: DataTypes.STRING,
    avatar_url: DataTypes.STRING,

    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    last_login: DataTypes.DATE,

    email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password_hash) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        },

        beforeUpdate: async (user) => {
            if (user.changed('password_hash')) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        }
    }
});

export default User;