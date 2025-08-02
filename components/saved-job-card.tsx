"use client";
import React, { useEffect } from "react";

function SavedJobCard({ savedJobId }) {
  const url = `https://jsearch.p.rapidapi.com/job-details?job_id=${savedJobId}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "ce201ab530mshe59659e3653ab99p125039jsnbc4ca48a8416",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };
  let currentJob;

  
  

  return <div className="py-3  px-2  md:px-20">{savedJobId}</div>;
}

export default SavedJobCard;
