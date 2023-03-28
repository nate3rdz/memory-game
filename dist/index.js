import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import userRouter, { routes as userRoutes } from './routes/user/user.router.js';
import matchRouter, { routes as matchRoutes } from './routes/match/match.router.js';
import rankingsRouter, { routes as rankingsRoutes } from './routes/rankings/rankings.router.js';
import * as mongooseService from './services/mongoose.service.js';
dotenv.config(); // config .env file
const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true, limit: '5mb' })); // x-www-form-urlencoded format
app.use(express.json({ limit: '5mb' })); // accepts raw json
app.use(cors()); // set cors policy
app.use(userRoutes.root, userRouter);
app.use(matchRoutes.root, matchRouter);
app.use(rankingsRoutes.root, rankingsRouter);
// Swagger initialization
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Memory The Game - Server',
            version: '0.4.0',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./api/routes/*/*Router.js', './api/routes/*/*/*Router.js', './dist/api/routes/*/*Router.js', './dist/api/routes/*/*/*Router.js'],
};
// generates swagger documentation
const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(openapiSpecification));
// connects to the mongoDB database
const connection = await mongooseService.openMongooseConnection();
app.all('*', (req, res) => res.status(404).json(`Can't find ${req.originalUrl} on this server!`).send());
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
});
export default app;
//# sourceMappingURL=index.js.map