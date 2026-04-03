const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const receiptsRouter     = require('./routes/receipts');
const transactionsRouter = require('./routes/transactions');
const summaryRouter      = require('./routes/summary');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/receipts',     receiptsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/summary',      summaryRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BudgetAI backend running on port ${PORT}`);
});