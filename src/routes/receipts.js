const express              = require('express');
const multer               = require('multer');
const { PrismaClient }     = require('@prisma/client');
const { scanReceipt }      = require('../services/vision');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({
  dest:   'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const aiResult = await scanReceipt(req.file.path);

    const receipt = await prisma.receipt.create({
      data: {
        merchantName: aiResult.merchant_name,
        receiptDate:  new Date(aiResult.receipt_date),
        totalAmount:  aiResult.total_amount,
        imageUrl:     req.file.path,
        aiRawText:    JSON.stringify(aiResult),
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        receiptId:       receipt.id,
        categoryId:      aiResult.category,
        description:     aiResult.merchant_name,
        amount:          aiResult.total_amount,
        aiClassified:    true,
        confidenceScore: aiResult.confidence,
      },
    });

    res.json({
      success:    true,
      receipt,
      transaction,
      ai_result:  aiResult,
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;