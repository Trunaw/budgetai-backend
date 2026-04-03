const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { id: 'food',      name: 'Ẩm thực',  colorHex: '#c8f55a', icon: 'food' },
    { id: 'transport', name: 'Di chuyển', colorHex: '#5a8aff', icon: 'transport' },
    { id: 'shopping',  name: 'Mua sắm',  colorHex: '#a78bfa', icon: 'shopping' },
    { id: 'health',    name: 'Y tế',     colorHex: '#ff6b6b', icon: 'health' },
    { id: 'utility',   name: 'Tiện ích', colorHex: '#ffb347', icon: 'utility' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where:  { id: cat.id },
      update: {},
      create: cat,
    });
  }
  console.log('Categories seeded!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());