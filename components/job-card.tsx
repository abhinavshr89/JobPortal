import Image from "next/image";
import React from "react";
import CustomButton from "./button";
import Link from "next/link";
import SaveButton from "./save-button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { EyeIcon } from "lucide-react";

function JobCard({ currentJob }) {
  return (
    <Card className="flex flex-col gap-2 hover:border-blue-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="py-3 bg-gray-900 w-fit px-2 rounded-md font-semibold text-lg">
          {currentJob.job_title}
        </CardTitle>
        <div className="flex items-center py-1 rounded-full gap-3 px-2 bg-gray-900 w-fit">
          {currentJob.employer_logo && (
            <Image
              src={currentJob.employer_logo}
              alt="employer logo"
              width={20}
              height={20}
            />
          )}
          <CardDescription className={currentJob.employer_logo ? "ml-1" : ""}>
            {currentJob.employer_name}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-2">
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full">
            {currentJob.job_location}
          </Badge>
          <Badge variant={currentJob.job_is_remote ? "default" : "outline"} className="text-xs px-3 py-1 rounded-full">
            {currentJob.job_is_remote ? "Remote" : "On-site"}
          </Badge>
        </div>
        <div className="text-sm text-gray-300 mt-2 line-clamp-4">
          {currentJob.job_description}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 pt-2 ">
        <Link href={`/job-page/${currentJob.job_id}`}>
          <Button
            className="bg-blue-600 p-2 rounded-md flex items-center gap-2 hover:scale-95 transition-transform"
          >
           
              <EyeIcon size={18} />
              View Details
           
          </Button>
        </Link>
        <div className="active:scale-95 transition-transform">
          <SaveButton currentJob={currentJob} />
        </div>
      </CardFooter>
    </Card>
  );
}

export default JobCard;

