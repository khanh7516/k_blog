import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log('🧨 Clearing existing data...');

  // Xoá theo thứ tự quan hệ: Post → User, Category
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // Reset ID sequences (PostgreSQL only)
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1`);

  console.log('✅ Data cleared. Seeding new data...');

  // Seed Users
  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Alice Smith",
        email: "alice@example.com",
        password: await bcrypt.hash("password1", 10),
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: await bcrypt.hash("password2", 10),
      },
    }),
    prisma.user.create({
      data: {
        name: "Charlie Lee",
        email: "charlie@example.com",
        password: await bcrypt.hash("password3", 10),
      },
    }),
    prisma.user.create({
      data: {
        name: "Khanh Ngo",
        email: "khanhng@example.com",
        password: await bcrypt.hash("password4", 10),
      },
    }),
  ]);

  // Seed Categories
  const categories = await prisma.$transaction([
    prisma.category.create({ data: { name: 'Technology' } }),
    prisma.category.create({ data: { name: 'Lifestyle' } }),
    prisma.category.create({ data: { name: 'Travel' } }),
    prisma.category.create({ data: { name: 'Other' } }),
  ]);

  // Sample posts
  const samplePosts = Array.from({ length: 5000 }).map(() => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(20),
    status: faker.helpers.arrayElement(['ACTIVE', 'DRAFT']),
  }));

  for (const post of samplePosts) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    await prisma.post.create({
      data: {
        ...post,
        authorId: randomUser.id,
        categoryId: randomCategory.id,
      },
    });
  }

  console.log('✅ Seed completed with multiple users, categories, and posts.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Seed error:', e);
    return prisma.$disconnect();
  });
