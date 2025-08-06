"use server";

import db from "@/lib/prisma";

export async function getAllJobs(filters?: {
    employmentType?: string;
    jobType?: string;
    minSalary?: string;
    maxSalary?: string;
    q?: string;
}) {
    try {
        
        const where: any = {};
        

        if (filters?.employmentType) {
            where.employment_type = filters.employmentType;
        }
        
        if (filters?.jobType) {
            where.job_type = filters.jobType;
        }
        
        
        if (filters?.minSalary || filters?.maxSalary) {
           
            where.salary = {};
            
          
            if (filters?.minSalary) {
                where.salary.gte = Number(filters.minSalary);
            }
            
            
            if (filters?.maxSalary) {
                where.salary.lte = Number(filters.maxSalary);
            }
        }
        
        
        if (filters?.q) {
            where.OR = [
                { title: { contains: filters.q, mode: "insensitive" } },
                { description: { contains: filters.q, mode: "insensitive" } }
            ];
        }

        // Execute database query
        const jobs = await db.job.findMany({
            where: Object.keys(where).length > 0 ? where : undefined,
        });

        return {
            success: true,
            jobs
        };
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return {
            success: false,
            message: "Failed to fetch jobs"
        };
    }
}


// const where = {
//     employment_type: "full-time",
//     job_type: "remote",
//     salary: {
//         gte: 50000,
//         lte: 100000
//     },
//     OR: [
//         { title: { contains: "developer", mode: "insensitive" } },
//         { description: { contains: "developer", mode: "insensitive" } }
//     ]
// }


export async function suggestJobs(query: string) {
    try {
        const jobs = await db.job.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            take: 5, 
            select: {
                id: true,
                title: true
            }
        });

        return {
            success: true,
            suggestions: jobs
        };
    } catch (error) {
        console.error("Error fetching job suggestions:", error);
        return {
            success: false,
            message: "Failed to fetch job suggestions"
        };
    }
}