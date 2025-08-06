import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, location, salary, employment_type, job_type, company_id } = body;

    if (!title || !description || !location || !salary || !employment_type || !job_type || !company_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newJob = await db.job.create({
      data: {
        title,
        description,
        location,
        salary: parseInt(salary),
        employment_type,
        job_type,
        company_id,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}