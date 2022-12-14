import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import {
  authRouter, 
  userRouter, 
  resourceRouter,
  teamRouter,
  syncRouter,
  membershipRouter,
  herdRouter,
  cowCensusRouter,
  plotRouter,
  dungCensusRouter,
  forageQualityCensusRouter,
  forageQuantityCensusRouter,
} from './routers';
import db from './db/db';

dotenv.config();

const app = express(); // initialize
app.use(cors()); // enable/disable cross origin resource sharing if necessary
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev')); // enable/disable http request logging
app.use(express.json({ limit: '100mb' }));

export const server = createServer(app);
const port = process.env.PORT;
server.listen({ port }, () => {
  console.log(`Server listening on port ${port}!`);
});

try {
  db.authenticate();
  console.log('Database connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// declare routers
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/auth', authRouter); // NOTE: Not secured
app.use('/users', userRouter); // NOTE: Completely secured to users
app.use('/resources', resourceRouter); // NOTE: Partially secured to users
app.use('/sync', syncRouter);
app.use('/teams', teamRouter);
app.use('/memberships', membershipRouter);
app.use('/herds', herdRouter);
app.use('/cow_censuses', cowCensusRouter);
app.use('/plots', plotRouter);
app.use('/dung_censuses', dungCensusRouter);
app.use('/forage_quality_censuses', forageQualityCensusRouter);
app.use('/forage_quantity_censuses', forageQuantityCensusRouter);
app.use((req, res) => { // Custom 404 middleware
  res.status(404).json({ message: 'The route you\'ve requested doesn\'t exist' });
});
app.use(validationErrorHandler);
app.use(errorHandler);

export default server;
