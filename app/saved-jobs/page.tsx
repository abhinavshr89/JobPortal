"use client";
import React from "react";
import SavedJobCard from "@/components/saved-job-card";

function SavedJob() {
  const savedJobs = localStorage.getItem("saved");
  let saved = savedJobs ? JSON.parse(savedJobs) : [];
  if (saved.length === 0) {
    return (
      <div className="text-center font-bold text-3xl mt-2 text-red-500">
        No Jobs Found
      </div>
    );
  }
  return (
    <div>
      {saved.map((job, index) => (
        <SavedJobCard key={index} savedJobId={job} />
      ))}
    </div>
  );
}

export default SavedJob;
