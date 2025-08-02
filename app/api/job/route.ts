import db from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request: Request){
   try {
     const {title, description, salary, location, employment_type, job_type} = await request.json();
    if(!title || !description || !location || !salary){
     return NextResponse.json({
         success: false,
         error: "Fill the required fields"
     }, { status: 400 });
 }
 
     // Here you would typically save the job to the database
     const job = await db.job.create({
         data: {
             title,
             description,
             salary: Number(salary),
             location,
             employment_type,
             job_type
         }
     })
        return NextResponse.json({
            success: true,
            message: "Job created successfully",
            job
        }, { status: 201 });
   } catch (error) {
     console.error("Error creating job:", error);
     return NextResponse.json({
         success: false,
         error: "Failed to create job"
     }, { status: 500 });
    
   }
}