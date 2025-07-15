import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const usersWithPosts = await prisma.user.findMany({
      where: {
        posts: {
          some: {},
        },
      },
    });

    return NextResponse.json(usersWithPosts);
  } catch (error) {
    console.error('Error fetching users with posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}