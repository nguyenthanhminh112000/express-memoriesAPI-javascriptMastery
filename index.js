import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import postsRouter from './routers/postsRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';

/////////////////CREATE EXPRESS-APP
const app = express();
dotenv.config();
///////////////// USE MIDDLEWARE
//parse incoming request with json
app.use(express.json());
//parse incoming request with urlencoded payloads
app.use(express.urlencoded());
// enable cors
app.use(cors());
app.use(
  cors({
    allowedHeaders: ['authorization', 'Content-Type'], // you can change the headers
    exposedHeaders: ['authorization'], // you can change the headers
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
);
/////////////////SET ROUTES
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/user', userRouter);
app.get('/', (req, res) => {
  res.send('App is running.');
});
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));
//////////////// CONNECT TO DATABASE

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });

// STOP SHOW WARNING ABOUT DATABASE
mongoose.set('useFindAndModify', false);
