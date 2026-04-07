import Sequelize from "sequelize"
import logger from "../../src/config/logger.js"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres", 
    logging: process.env.NODE_ENV === "development"
    ? (msg) => logger.debug(msg)
    : false,

    pool: {
        max: 5,
        min: 2,
        acquire: 30000,
        idle: 10000
    },

    define: {
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

sequelize.authenticate()
    .then(() => logger.info("Database connected"))
    .catch((err) => log.info("Database connection failed: ", err));

export default sequelize