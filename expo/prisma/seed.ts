import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Test User',
      age: 25,
      howFound: 'Search Engine',
    },
  });

  console.log('Created user:', user1.email);

  const categories = [
    { name: 'Trabalho', color: '#3B82F6', icon: 'briefcase' },
    { name: 'Pessoal', color: '#10B981', icon: 'user' },
    { name: 'Estudos', color: '#F59E0B', icon: 'book' },
    { name: 'Saúde', color: '#EF4444', icon: 'heart' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log('Created categories');

  const workCategory = await prisma.category.findUnique({
    where: { name: 'Trabalho' },
  });

  if (workCategory) {
    await prisma.todo.create({
      data: {
        title: 'Completar relatório mensal',
        priority: 'urgent',
        userId: user1.id,
        categoryId: workCategory.id,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    console.log('Created sample todo');
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
