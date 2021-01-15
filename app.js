import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js'; //eslint-disable-line
import categoryRoutes from './routes/category.js'; //eslint-disable-line
import newsRoutes from './routes/news.js'; //eslint-disable-line

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(json());

app.use(authRoutes);
app.use(categoryRoutes);
app.use(newsRoutes);

app.use((error, req, res, next) => { //eslint-disable-line
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message, data });
});

mongoose.connect(
  //add your cluster link
"",
  { useNewUrlParser: true, useUnifiedTopology: true },
)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err)); //eslint-disable-line
