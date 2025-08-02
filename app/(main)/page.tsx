import React, { Suspense } from "react";
import SideBar from "@/components/sidebar";
import { getAllJobs } from "@/action/job.action";
import NewJobCard from "@/components/new-job-card";

// Types
interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  employment_type: string;
  job_type: string;
  // Add other job properties as needed
}

interface SearchParams {
  q?: string;
}

interface HomeProps {
  searchParams: {
    q?: string;
    employmentType?: string;
    jobType?: string;
    minSalary?: string;
    maxSalary?: string;
  }
}

// Uncomment if you need dynamic rendering
// export const dynamic = "force-dynamic";

async function Home({ searchParams }: HomeProps) {
  
  const filters = {
    employmentType: await searchParams.employmentType,
    jobType: await searchParams.jobType,
    minSalary: await searchParams.minSalary,
    maxSalary: await searchParams.maxSalary,
    q: await searchParams.q, // <-- add this line
  };

  const result = await getAllJobs(filters);
  

  const jobs = result.success ? result.jobs : [];
  const error = result.success ? null : result.message;

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Error Loading Jobs
        </h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // No data state
  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-2">
          No Jobs Found
        </h2>
        <p className="text-gray-500">
          Try searching with different keywords or location.
        </p>
      </div>
    );
  }

  // Success state
  return (
    <div className="pl-3">
      <SideBar />
      <div className="w-[80%] ml-auto py-6 px-4 font-poppins">
        <div className="mb-6 mt-[70px]">
          {/* <h1 className="text-2xl font-bold mb-2">
            Job Search Results
          </h1>
          <p className="text-gray-600">
            Showing all jobs
          </p> */}
        </div>
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
          {jobs.map((job: any) => (
            <NewJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;