import "dotenv/config"
import express from "express"
import cors from "cors"
import sequelize from "./src/config/database.js"

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", async(req, res) => {
    try {
        const result = await sequelize.query("SELECT current_database()");
        res.send(`The database name is ${result[0][0].current_database}`);
    } catch(error) {
        res.status(500).send('Database error: ' + error.message);
    }
})

app.listen(port, () => {
    console.log(`The server is running on ${port}`);
})