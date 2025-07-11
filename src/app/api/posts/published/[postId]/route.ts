import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PostStatus } from '@prisma/client';

export async function GET(_: Request, { params }: { params: { postId: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.postId), status: PostStatus.ACTIVE },
    include: { author: true, category: true },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}