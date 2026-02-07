import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const storySchema = z.object({
  title: z.string().min(3),
  content: z.string().min(100),
  category: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  authorRole: z.string().optional(),
  university: z.string().optional(),
  graduationYear: z.string().optional(),
  imageUrl: z.string().optional(),
});

// GET /api/success-stories - Récupérer toutes les stories actives
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: any = { isActive: true };
    if (category) where.category = category;
    if (featured === "true") where.isFeatured = true;

    const stories = await prisma.successStory.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { likes: "desc" }],
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Erreur GET stories:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/success-stories - Créer une nouvelle story
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = storySchema.parse(body);

    const story = await prisma.successStory.create({
      data: validated,
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Erreur POST story:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
