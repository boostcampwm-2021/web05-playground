import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import 'express-async-errors';

import { ApolloServer } from 'apollo-server-express';

import depthLimit from 'graphql-depth-limit';
import compression from 'compression';

import schema from './graphql/schema';

import BaseRouter from './routes';

const app = express();

const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
});

const { BAD_REQUEST } = StatusCodes;

const corsOption: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: '*',
    origin: process.env.CORS_HOST,
};

app.use(compression());

server.start().then(() => {
    server.applyMiddleware({
        app,
        path: '/graphql',
    });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

//Route
app.use('/api', BaseRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

export default app;
