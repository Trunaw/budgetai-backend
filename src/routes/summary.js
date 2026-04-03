const express          = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year  = parseInt(req.query.year)  || new Date().getFullYear();

    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 1);

    const byCategory = await prisma.transaction.groupBy({
      by:    ['categoryId'],
      where: { createdAt: { gte: start, lt: end } },
      _sum:  { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const total = byCategory.reduce(
      (sum, cat) => sum + (cat._sum.amount || 0), 0
    );

    res.json({
      month,
      year,
      total:       Math.round(total * 100) / 100,
      by_category: byCategory.map(cat => ({
        category_id: cat.categoryId,
        total:       Math.round((cat._sum.amount || 0) * 100) / 100,
        percentage:  total > 0
          ? Math.round((cat._sum.amount || 0) / total * 100)
          : 0,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;