import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const scholarshipSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["bourse", "concours"]),
  organization: z.string(),
  description: z.string(),
  eligibility: z.string().optional(),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  applyLink: z.string().optional(),
  contactInfo: z.string().optional(),
  domain: z.string().optional(),
  location: z.string().optional(),
});

// GET /api/scholarships - Récupérer toutes les bourses/concours actifs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const location = searchParams.get("location");

    const where: any = { isActive: true };
    if (type) where.type = type;
    if (location) where.location = location;

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json(scholarships);
  } catch (error) {
    console.error("Erreur GET scholarships:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/scholarships - Créer une nouvelle bourse/concours
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = scholarshipSchema.parse(body);

    const scholarship = await prisma.scholarship.create({
      data: {
        ...validated,
        deadline: validated.deadline ? new Date(validated.deadline) : undefined,
      },
    });

    return NextResponse.json(scholarship, { status: 201 });
  } catch (error) {
    console.error("Erreur POST scholarship:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
