import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log('🧨 Clearing existing data...');

  await prisma.commentFavorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postFavorite.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "PostFavorite_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "CommentFavorite_id_seq" RESTART WITH 1`);

  console.log('✅ Data cleared. Seeding new data...');

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

  const categories = await prisma.$transaction([
    prisma.category.create({ data: { name: 'Technology' } }),
    prisma.category.create({ data: { name: 'Lifestyle' } }),
    prisma.category.create({ data: { name: 'Travel' } }),
    prisma.category.create({ data: { name: 'Other' } }),
  ]);

  const userIds = users.map(u => u.id);

  const allPosts = [];

  for (let i = 0; i < 5000; i++) {
    const title = faker.lorem.sentence();
    const content = faker.lorem.paragraphs(20);
    const status = faker.helpers.arrayElement(['ACTIVE', 'DRAFT']);
    const authorId = faker.helpers.arrayElement(userIds);
    const categoryId = faker.helpers.arrayElement(categories).id;

    const likedBy = faker.helpers.arrayElements(userIds, faker.number.int({ min: 0, max: userIds.length }));

    const post = await prisma.post.create({
      data: {
        title,
        content,
        status,
        authorId,
        categoryId,
        favoritesCount: likedBy.length,
      },
    });

    allPosts.push(post);

    for (const userId of likedBy) {
      await prisma.postFavorite.create({
        data: {
          postId: post.id,
          userId,
        },
      });
    }
  }

  const allComments = [];

  for (const post of allPosts.slice(0, 1000)) {
    const commentCount = faker.number.int({ min: 3, max: 7 });
    for (let i = 0; i < commentCount; i++) {
      const authorId = faker.helpers.arrayElement(userIds);
      const possibleParents = allComments.filter(c => c.postId === post.id);
      const parent = possibleParents.length > 0 && Math.random() < 0.25
        ? faker.helpers.arrayElement(possibleParents)
        : undefined;

      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentences(2),
          postId: post.id,
          authorId,
          parentId: parent?.id ?? null,
        },
      });

      allComments.push(comment);
    }
    await prisma.post.update({
      where: { id: post.id },
      data: { commentsCount: commentCount },
    });
  }

  for (const comment of allComments) {
    const likedBy = faker.helpers.arrayElements(userIds, faker.number.int({ min: 0, max: userIds.length }));
    for (const userId of likedBy) {
      await prisma.commentFavorite.create({
        data: {
          commentId: comment.id,
          userId,
        },
      });
    }
  }

  console.log('✅ Seed completed.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Seed error:', e);
    return prisma.$disconnect();
  });
