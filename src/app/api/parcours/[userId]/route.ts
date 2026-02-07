import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema de validation pour le parcours
const parcoursSchema = z.object({
  userId: z.string(),
  university: z.string().optional(),
  filiere: z.string().optional(),
  anneeEnCours: z.string().optional(),
  objectifs: z.any().optional(),
  notes: z.any().optional(),
});

// GET /api/parcours/[userId] - Récupérer le parcours d'un utilisateur
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const parcours = await prisma.parcours.findUnique({
      where: { userId },
    });

    if (!parcours) {
      return NextResponse.json(
        { error: "Parcours non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(parcours);
  } catch (error) {
    console.error("Erreur GET parcours:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/parcours/[userId] - Créer ou mettre à jour le parcours
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const validated = parcoursSchema.parse(body);

    const parcours = await prisma.parcours.upsert({
      where: { userId },
      update: {
        university: validated.university,
        filiere: validated.filiere,
        anneeEnCours: validated.anneeEnCours,
        objectifs: validated.objectifs || [],
        notes: validated.notes || [],
      },
      create: {
        userId,
        university: validated.university,
        filiere: validated.filiere,
        anneeEnCours: validated.anneeEnCours,
        objectifs: validated.objectifs || [],
        notes: validated.notes || [],
      },
    });

    return NextResponse.json(parcours);
  } catch (error) {
    console.error("Erreur PUT parcours:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
