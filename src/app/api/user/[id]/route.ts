import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        cvProfile: true,
        advisorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transformer les données JSON stockées
    const cvProfile = user.cvProfile
      ? {
          ...user.cvProfile,
          education: user.cvProfile.education || [],
          experiences: user.cvProfile.experiences || [],
          projects: user.cvProfile.projects || [],
        }
      : null;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdvisor: !!user.advisorProfile,
        advisorProfile: user.advisorProfile,
        cvProfile,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("GET user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { isAdvisor, advisorProfile, cvProfile } = body;

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { advisorProfile: true, cvProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mettre à jour le profil conseiller
    if (typeof isAdvisor === "boolean") {
      if (isAdvisor && advisorProfile) {
        await prisma.advisorProfile.upsert({
          where: { userId: user.id },
          update: advisorProfile,
          create: { userId: user.id, ...advisorProfile },
        });
      } else if (!isAdvisor && user.advisorProfile) {
        await prisma.advisorProfile.delete({
          where: { userId: user.id },
        });
      }
    }

    // Mettre à jour le profil CV
    if (cvProfile) {
      await prisma.cvProfile.upsert({
        where: { userId: user.id },
        update: cvProfile,
        create: { userId: user.id, ...cvProfile },
      });
    }

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        cvProfile: true,
        advisorProfile: true,
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser!.id,
        email: updatedUser!.email,
        name: updatedUser!.name,
        role: updatedUser!.role,
        isAdvisor: !!updatedUser!.advisorProfile,
        advisorProfile: updatedUser!.advisorProfile,
        cvProfile: updatedUser!.cvProfile,
        createdAt: updatedUser!.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("PATCH user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
