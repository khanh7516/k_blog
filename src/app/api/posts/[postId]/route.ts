import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(_: Request, { params }: { params: { postId: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.postId) },
    include: { author: true, category: true },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  authorId: z.number().int().optional(),
  categoryId: z.number().int().optional(),
});

export async function PUT(req: Request, { params }: { params: { postId: string } }) {
  try {
    const json = await req.json();
    const body = UpdatePostSchema.parse(json);

    const post = await prisma.post.update({
      where: { id: Number(params.postId) },
      include: { author: true, category: true },
      data: body,
    });

    return NextResponse.json(post);
  } catch (error) {
    const formatError = error as { code?: string };

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    if (formatError.code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { postId: string } }) {
  try {
    await prisma.post.delete({
      where: { id: Number(params.postId) },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    const formatError = error as { code?: string };
    if (formatError.code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


