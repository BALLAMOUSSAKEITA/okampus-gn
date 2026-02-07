import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["universitaire", "national", "examen", "vacances", "autre"]),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  university: z.string().optional(),
  isRecurrent: z.boolean().default(false),
  color: z.string().optional(),
});

// GET /api/calendar - Récupérer tous les événements actifs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: any = { isActive: true };
    if (type) where.type = type;

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erreur GET calendar:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/calendar - Créer un nouvel événement
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = eventSchema.parse(body);

    const event = await prisma.calendarEvent.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : undefined,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Erreur POST event:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
