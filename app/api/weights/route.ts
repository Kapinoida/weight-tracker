// app/api/weights/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const weights = await prisma.weight.findMany({
      orderBy: {
        date: "asc",
      },
      select: {
        date: true,
        weight: true,
        user: {
          select: {
            birthDate: true,
            height: true,
          },
        },
      },
    });

    return NextResponse.json(weights);
  } catch (error) {
    console.error("GET /api/weights error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weights" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log("Received weight data:", json);

    // First, we need to ensure we have a user
    let user = await prisma.user.findFirst();

    // If no user exists, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          // Add default values as needed
        },
      });
    }

    const newWeight = await prisma.weight.create({
      data: {
        weight: parseFloat(json.weight),
        date: new Date(),
        userId: user.id, // Use the actual user ID
      },
    });

    console.log("Created weight entry:", newWeight);

    return NextResponse.json(newWeight);
  } catch (error) {
    console.error("POST /api/weights error:", error);
    return NextResponse.json(
      {
        error: "Failed to add weight",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
