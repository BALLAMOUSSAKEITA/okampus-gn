import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  category: z.string(),
  status: z.enum(["idea", "in_progress", "launched"]),
  teamSize: z.number().default(1),
  seeking: z.string().optional(),
  website: z.string().optional(),
  contactInfo: z.string().optional(),
  authorId: z.string(),
});

// GET /api/entrepreneur - Récupérer tous les projets actifs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: any = { isActive: true };
    if (category) where.category = category;
    if (status) where.status = status;

    const projects = await prisma.entrepreneurProject.findMany({
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

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erreur GET projects:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/entrepreneur - Créer un nouveau projet
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = projectSchema.parse(body);

    const project = await prisma.entrepreneurProject.create({
      data: validated,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erreur POST project:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
