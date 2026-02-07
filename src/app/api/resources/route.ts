import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const resourceSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  category: z.string(),
  subject: z.string(),
  filiere: z.string().optional(),
  university: z.string().optional(),
  year: z.string().optional(),
  fileUrl: z.string().url(),
  fileType: z.string(),
  fileSize: z.number(),
  price: z.number().default(0),
  isPremium: z.boolean().default(false),
  authorId: z.string(),
});

// GET /api/resources - Récupérer toutes les ressources actives
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subject = searchParams.get("subject");

    const where: any = { isActive: true };
    if (category) where.category = category;
    if (subject) where.subject = subject;

    const resources = await prisma.resource.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Erreur GET resources:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/resources - Créer une nouvelle ressource
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = resourceSchema.parse(body);

    const resource = await prisma.resource.create({
      data: validated,
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Erreur POST resource:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
