import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import postsRouter from './routers/postsRouter.js';

/////////////////CREATE EXPRESS-APP
const app = express();
///////////////// USE MIDDLEWARE
//parse incoming request with json
app.use(express.json());
//parse incoming request with urlencoded payloads
app.use(express.urlencoded());
// enable cors
app.use(cors());

/////////////////SET ROUTES
app.use('/api/v1/posts', postsRouter);
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));
//////////////// CONNECT TO DATABASE
const CONNECTION_URL =
  'mongodb+srv://memories:memories123@cluster0.h9mgz.mongodb.net/memoriesSocialNetwork?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

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
