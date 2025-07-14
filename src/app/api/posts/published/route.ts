import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PostStatus } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get('title') || undefined;
  const authorId = searchParams.get('authorId');
  const categoryIds = searchParams.getAll("category").map(id => parseInt(id)).filter(Boolean);
  const createdFrom = searchParams.get('createdFrom');
  const createdTo = searchParams.get('createdTo');
  const updatedFrom = searchParams.get('updatedFrom');
  const updatedTo = searchParams.get('updatedTo');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

  const validSortFields = ['createdAt', 'favoritesCount'];
  const orderBy: Record<string, 'asc' | 'desc'> = {};

  const cursor = searchParams.get('cursor');
  const take = parseInt(searchParams.get('take') || '10');

  const filters: any = {
    status: PostStatus.ACTIVE,
  };

  if (validSortFields.includes(sortBy)) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy['createdAt'] = 'desc';
  }

  if (title) {
    filters.title = { contains: title, mode: 'insensitive' };
  }

  if (authorId) {
    filters.authorId = Number(authorId);
  }

  if (categoryIds.length > 0) {
    filters.categoryId = { in: categoryIds };
  }

  if (createdFrom || createdTo) {
    filters.createdAt = {};
    if (createdFrom) filters.createdAt.gte = new Date(createdFrom);
    if (createdTo) {
      const end = new Date(createdTo);
      end.setUTCHours(23, 59, 59, 999);
      filters.createdAt.lte = end;
    }
  }

  if (updatedFrom || updatedTo) {
    filters.updatedAt = {};
    if (updatedFrom) filters.updatedAt.gte = new Date(updatedFrom);
    if (updatedTo) {
      const end = new Date(updatedTo);
      end.setUTCHours(23, 59, 59, 999);
      filters.updatedAt.lte = end;
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where: filters,
      include: { author: true, category: true },
      orderBy,
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
    });

    const nextCursor = posts.length === take ? posts[posts.length - 1].id : null;

    return NextResponse.json({ posts, nextCursor });
  } catch (error) {
    console.error('Error in filter API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
