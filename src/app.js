const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const receiptsRouter     = require('./routes/receipts');
const transactionsRouter = require('./routes/transactions');
const summaryRouter      = require('./routes/summary');

const app = express();
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ping Supabase mỗi ngày lúc 8am để giữ active
cron.schedule('0 8 * * *', async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Supabase ping OK:', new Date().toISOString());
  } catch (error) {
    console.error('Supabase ping failed:', error.message);
  }
});
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