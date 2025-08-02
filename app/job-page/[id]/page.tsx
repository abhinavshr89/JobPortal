import Image from "next/image";
import React from "react";
import { Divide, LinkIcon } from "lucide-react";
import { ArrowRightSquare } from "lucide-react";

async function JobPage({ params }) {
  const { id } = params;
  console.log(id);

  const url = `https://jsearch.p.rapidapi.com/job-details?job_id=${id}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "ce201ab530mshe59659e3653ab99p125039jsnbc4ca48a8416",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };
  let currentJob;
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    currentJob = result.data[0];
    console.log(currentJob.job_description);
  } catch (error) {
    console.error(error);
  }

  // Function to parse and render job description
  const renderJobDescription = (description) => {
    const lines = description.split('\n').filter(line => line.trim().length > 0);
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if it's a bullet point (starts with • or similar)
      const isBulletPoint = trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*');
      
      // Check if it's a heading (doesn't start with bullet and doesn't end with punctuation like . or ,)
      const isHeading = !isBulletPoint && 
                       !trimmedLine.endsWith('.') && 
                       !trimmedLine.endsWith(',') && 
                       trimmedLine.length > 10 && // Reasonable length for a heading
                       !trimmedLine.includes('experience') || // Special cases
                       trimmedLine.toLowerCase().includes('responsibilities') ||
                       trimmedLine.toLowerCase().includes('qualifications') ||
                       trimmedLine.toLowerCase().includes('capabilities') ||
                       trimmedLine.toLowerCase().includes('skills');
      
      if (isHeading) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-3 w-full tracking-wide text-blue-400">
            {trimmedLine}
          </h2>
        );
      } else if (isBulletPoint) {
        return (
          <div key={index} className="flex gap-4 items-start mb-2">
            <ArrowRightSquare size={20} className="min-w-[20px] mt-1 text-blue-300" />
            <p className="text-base leading-relaxed">{trimmedLine.substring(1).trim()}</p>
          </div>
        );
      } else {
        // Regular paragraph
        return (
          <p key={index} className="text-base leading-relaxed mb-3 text-gray-300">
            {trimmedLine}
          </p>
        );
      }
    });
  };

  return (
    <div className="w-full pt-[100px] min-h-[80vh] py-6 px-2 md:px-32 mt-4 flex flex-col gap-6 bg-zinc-900/90 rounded-2xl shadow-xl border border-zinc-800 text-white">
      <h1 className="font-bold text-3xl md:text-4xl tracking-tight mb-2">{currentJob.job_title}</h1>
      
      <div className="flex items-center py-2 mt-2 rounded-full gap-4 px-4 bg-zinc-800 w-fit shadow">
        {currentJob.employer_logo && (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 overflow-hidden">
            <Image
              src={currentJob.employer_logo}
              alt="employer logo"
              width={40}
              height={40}
              className="object-contain w-8 h-8"
            />
          </div>
        )}
        <h3 className="text-lg font-medium">{currentJob.job_publisher}</h3>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center py-1 rounded-full gap-2 px-4 bg-zinc-800 w-fit text-sm font-medium">
          {currentJob.job_location}
        </div>
        <div className="flex items-center py-1 rounded-full gap-2 px-4 bg-zinc-800 w-fit text-sm font-medium">
          {currentJob.job_is_remote ? "Remote" : "On-site"}
        </div>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform p-3 rounded-lg w-fit flex items-center gap-2 font-semibold text-white shadow">
        Apply links
        <LinkIcon size={20} />
      </button>

      <div className="mt-4">
        {renderJobDescription(currentJob.job_description)}
      </div>
    </div>
  );
}

export default JobPage;
