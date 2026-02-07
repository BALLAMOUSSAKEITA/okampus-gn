import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const purchaseSchema = z.object({
  userId: z.string(),
  amount: z.number(),
});

// POST /api/resources/[resourceId]/purchase - Acheter une ressource
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const body = await request.json();
    const validated = purchaseSchema.parse(body);

    // Vérifier si la ressource existe
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource || !resource.isActive) {
      return NextResponse.json(
        { error: "Ressource non disponible" },
        { status: 404 }
      );
    }

    // Vérifier si déjà acheté
    const existing = await prisma.resourcePurchase.findFirst({
      where: {
        userId: validated.userId,
        resourceId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ressource déjà achetée" },
        { status: 409 }
      );
    }

    // Créer l'achat
    const purchase = await prisma.resourcePurchase.create({
      data: {
        userId: validated.userId,
        resourceId,
        amount: validated.amount,
      },
    });

    // Incrémenter les téléchargements
    await prisma.resource.update({
      where: { id: resourceId },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Erreur POST purchase:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
