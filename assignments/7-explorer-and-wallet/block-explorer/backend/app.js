import express from 'express';
import { PORT } from './config/env.js';
import blockRouter from './routes/blocks.routes.js';
import txnRouter from './routes/txn.routes.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET'],
  })
);

app.use(express.json());
app.use('/api/v1/blocks', blockRouter);
app.use('/api/v1/txns', txnRouter);

app.get('/', (req, res) => {
  res.send('Working...');
});

app.listen(5500, async () => {
  console.log(`Working on http://localhost:${PORT}`);
});
