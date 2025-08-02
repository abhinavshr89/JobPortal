"use client";

import { SaveIcon } from "lucide-react";
import { Button } from "./ui/button";

function SaveButton({ currentJob }) {
  const handleClick = () => {
      const savedJobs = localStorage.getItem("saved");
      let saved = savedJobs ? JSON.parse(savedJobs) : [];
      if(saved.length > 0){
        localStorage.removeItem("saved");
      }
      const newSavedJobs = [...saved, currentJob.job_id];
      localStorage.setItem("saved",JSON.stringify(newSavedJobs));

  };
  return (
    <Button onClick={handleClick} className="bg-blue-600 p-2 rounded-md flex items-center gap-2 hover:scale-95 transition-transform">
      <SaveIcon size={18} />
      Save
    </Button>
  );
}

export default SaveButton;
