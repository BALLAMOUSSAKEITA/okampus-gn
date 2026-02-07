import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema de validation pour une candidature
const applicationSchema = z.object({
  userId: z.string(),
  message: z.string().optional(),
});

// POST /api/stages/[offerId]/apply - Postuler à une offre
export async function POST(
  request: Request,
  { params }: { params: { offerId: string } }
) {
  try {
    const body = await request.json();
    const validated = applicationSchema.parse(body);

    // Vérifier si l'offre existe
    const offer = await prisma.stageOffer.findUnique({
      where: { id: params.offerId },
    });

    if (!offer || !offer.isActive) {
      return NextResponse.json(
        { error: "Offre non disponible" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà postulé
    const existingApplication = await prisma.stageApplication.findFirst({
      where: {
        userId: validated.userId,
        offerId: params.offerId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Vous avez déjà postulé à cette offre" },
        { status: 409 }
      );
    }

    // Créer la candidature
    const application = await prisma.stageApplication.create({
      data: {
        userId: validated.userId,
        offerId: params.offerId,
        message: validated.message,
        status: "pending",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Erreur POST application:", error);
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

// GET /api/stages/[offerId]/apply - Récupérer les candidatures d'un utilisateur
export async function GET(
  request: Request,
  { params }: { params: { offerId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId requis" },
        { status: 400 }
      );
    }

    const application = await prisma.stageApplication.findFirst({
      where: {
        userId,
        offerId: params.offerId,
      },
      include: {
        offer: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Candidature non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Erreur GET application:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
