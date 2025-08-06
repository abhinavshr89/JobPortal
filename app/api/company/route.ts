import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, location, logo, ownerId } = body;

    if (!name || !description || !location || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCompany = await db.company.create({
      data: {
        name,
        description,
        location,
        logo,
        ownerId,
      },
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
    }

    const company = await db.company.findFirst({
      where: {
        ownerId: ownerId,
      },
    });

    return NextResponse.json({ hasCompany: !!company, company }, { status: 200 });
  } catch (error) {
    console.error("Error checking company:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
