import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already in use.' }, { status: 409 });
    }

    const existingUsername = await prisma.user.findFirst({
      where: { name: username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username is already taken.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'Account created successfully.',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'An error occurred while registering the account.' },
      { status: 500 }
    );
  }
}