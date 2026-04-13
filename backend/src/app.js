import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import authRoutes from './routes/auth.js';


import logger from './config/logger.js';
// import errorHandler from './middleware/errorHandler.js';
// import loggerMiddleware from './middleware/logger.js'

const app = express();


app.use(helmet())

app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true}));

// app.use(cors)


// app.use(loggerMiddleware);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRoutes)

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// app.use(errorHandler);
export default app;