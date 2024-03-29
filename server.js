import express from 'express'
import sequelize from './config/sequelize.js'
import userRoutes from './routes/users.js'
import productRoutes from './routes/products.js'
import logger from './config/logger.js'
import statsdClient from './config/statsd.js'

// dotenv.config()
const app = express()
sequelize.sync().then((res)=>{
    // 
}).catch((error) => {
})

app.use(express.json());
// Default
app.get('/healthz', (req, res) => {
    try {
        statsdClient.increment("healthz");
        const response = {
            method: "GET",
            endpoint: "/healthz",
            status: 200
        };
        logger.info(response);
        res.status(200).send();
    } catch (error) {
        const response = {
            method: "GET",
            endpoint: "/healthz",
            status: 400
        };
        logger.error(response);
        res.status(400).send();
    }
});

// Route for CI/CD
app.get('/cicd', (req, res) => {
    try {
        statsdClient.increment("CI/CD");
        const response = {
            method: "GET",
            endpoint: "/cicd",
            status: 200
        };
        logger.info(response);
        res.status(200).send(response);
    } catch (error) {
        const response = {
            method: "GET",
            endpoint: "/cicd",
            status: 400
        };
        logger.error(response);
        res.status(400).send();
    }
});
// Routes
app.use("/v2", userRoutes)
app.use("/v2", productRoutes)
const port = 8080
export const server = app.listen(port, () => {
    logger.info(`Webapp runs at ${port}`);
})

