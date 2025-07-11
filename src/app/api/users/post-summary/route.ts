// src/app/api/user/post-summary/route.ts
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const email = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  const [activeCount, draftCount] = await Promise.all([
    prisma.post.count({
      where: {
        authorId: user.id,
        status: "ACTIVE",
      },
    }),
    prisma.post.count({
      where: {
        authorId: user.id,
        status: "DRAFT",
      },
    }),
  ]);

  return Response.json({
    email,
    userId: user.id,
    posts: {
      ACTIVE: activeCount,
      DRAFT: draftCount,
    },
  });
}
