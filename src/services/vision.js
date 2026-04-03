const Anthropic = require('@anthropic-ai/sdk');
const fs        = require('fs');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function scanReceipt(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const base64    = imageData.toString('base64');

  const response = await client.messages.create({
    model:      'claude-opus-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type:   'image',
            source: {
              type:       'base64',
              media_type: 'image/jpeg',
              data:       base64,
            },
          },
          {
            type: 'text',
            text: `Đọc hoá đơn này và trả về JSON với format sau, không thêm gì khác:
{
  "merchant_name": "tên cửa hàng",
  "total_amount": 0.00,
  "receipt_date": "YYYY-MM-DD",
  "category": "food|transport|shopping|health|utility",
  "items": ["item 1", "item 2"],
  "confidence": 0.95
}`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].text;

// Extract JSON từ response — AI đôi khi wrap trong markdown
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  throw new Error('AI không trả về JSON hợp lệ: ' + text);
}
return JSON.parse(jsonMatch[0]);
}

module.exports = { scanReceipt };