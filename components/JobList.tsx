import React from "react";
import JobCard from "@/components/job-card";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string;
  job_country: string;
  job_description: string;
  job_apply_link: string;
}

interface JobListProps {
  q: string;
}

async function JobList({ q }: JobListProps) {
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(q)}&page=1&num_pages=1&country=us&date_posted=all`;
  const options = {
    method: "GET",
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'ce201ab530mshe59659e3653ab99p125039jsnbc4ca48a8416',
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    }
  };

  let data: Job[] = [];
  let error: string | null = null;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    const result = await response.json();
    data = result.data || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch jobs";
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Error Loading Jobs
        </h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((job, index) => (
        <JobCard 
          key={job.job_id || index} 
          currentJob={job} 
        />
      ))}
    </div>
  );
}

export default JobList;
