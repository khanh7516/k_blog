import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || undefined;
  const authorId = searchParams.get("author") || undefined;
  const categoryIds = searchParams.getAll("category").map(id => parseInt(id)).filter(Boolean);
  const createdFrom = searchParams.get("createdFrom");
  const createdTo = searchParams.get("createdTo");
  const updatedFrom = searchParams.get("updatedFrom");
  const updatedTo = searchParams.get("updatedTo");
  const status = searchParams.get("status");
  const order = searchParams.get("order") || "desc";

  const filters: any = {};

  if (title) {
    filters.title = { contains: title, mode: "insensitive" };
  }

  if (authorId) {
    filters.authorId = authorId;
  }

  if (categoryIds.length > 0) {
    filters.categoryId = { in: categoryIds };
  }

  if (createdFrom || createdTo) {
    filters.createdAt = {};
    if (createdFrom) {
      filters.createdAt.gte = new Date(createdFrom);
    }
    if (createdTo) {
      const endOfDay = new Date(createdTo);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filters.createdAt.lte = endOfDay;
    }
  }

  if (updatedFrom || updatedTo) {
    filters.updatedAt = {};
    if (updatedFrom) {
      filters.updatedAt.gte = new Date(updatedFrom);
    }
    if (updatedTo) {
      const endOfDay = new Date(updatedTo);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filters.updatedAt.lte = endOfDay;
    }
  }


  if (status) {
    filters.status = status;
  }

  const posts = await prisma.post.findMany({
    where: filters,
    include: { author: true, category: true },
    orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
  });

  return NextResponse.json(posts);
}

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  authorId: z.number().int(),
  categoryId: z.number().int(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = CreatePostSchema.parse(json);

    const post = await prisma.post.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

