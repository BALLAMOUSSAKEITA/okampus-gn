import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema de validation pour une offre de stage
const stageOfferSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  location: z.string().min(2),
  type: z.enum(["stage", "job_etudiant", "alternance"]),
  domain: z.string(),
  description: z.string(),
  requirements: z.string().optional(),
  duration: z.string().optional(),
  remuneration: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  externalLink: z.string().url().optional(),
});

// GET /api/stages - Récupérer toutes les offres actives
export async function GET() {
  try {
    const offers = await prisma.stageOffer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Erreur GET stages:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST /api/stages - Créer une nouvelle offre de stage
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = stageOfferSchema.parse(body);

    const newOffer = await prisma.stageOffer.create({
      data: validated,
    });

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error("Erreur POST stage:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
