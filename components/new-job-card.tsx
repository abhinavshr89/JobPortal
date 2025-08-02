import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Building2, Clock, ArrowUpRight } from "lucide-react"

interface NewJobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: string;
    employment_type: string;
    job_type: string;
  };
}

function NewJobCard({ job }: NewJobCardProps) {
  return (
    <Card className="group relative bg-card border border-border 
                     hover:border-ring hover:shadow-lg 
                     transition-all duration-300 ease-out 
                     rounded-2xl overflow-hidden mb-6
                     hover:scale-[1.02] hover:-translate-y-1
                     before:absolute before:inset-0 before:bg-gradient-to-br 
                     before:from-primary/5 before:to-secondary/5 
                     before:opacity-0 hover:before:opacity-100 
                     before:transition-opacity before:duration-300">
      
      {/* Subtle gradient overlay on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
                      from-primary via-primary/80 to-secondary 
                      opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300" />
      
      <CardHeader className="pb-4 pt-6 px-6 relative">
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-xl font-semibold text-card-foreground 
                               leading-tight group-hover:text-primary 
                               transition-colors duration-200 flex-1 pr-2">
            {job.title}
          </CardTitle>
          
          {/* Hover indicator */}
          <div className="opacity-0 group-hover:opacity-100 
                          transition-all duration-200 
                          transform translate-x-2 group-hover:translate-x-0">
            <ArrowUpRight size={18} className="text-primary" />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground
                          group-hover:text-foreground transition-colors duration-200">
            <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 
                            transition-colors duration-200">
              <MapPin size={14} className="text-primary" />
            </div>
            <span className="font-medium">{job.location}</span>
          </div>
          
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          
          <div className="flex items-center gap-2 text-muted-foreground
                          group-hover:text-foreground transition-colors duration-200">
            <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 
                            group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/40
                            transition-colors duration-200">
              <DollarSign size={14} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {job.salary}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2 relative">
        <p className="text-muted-foreground text-sm leading-relaxed 
                      line-clamp-3 mb-5 group-hover:text-foreground/80
                      transition-colors duration-200">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2.5">
          <Badge className="bg-primary/10 hover:bg-primary/20 
                           text-primary border border-primary/20 
                           hover:border-primary/30
                           text-xs font-medium px-3 py-1.5 rounded-full
                           transition-all duration-200 
                           flex items-center gap-1.5
                           shadow-sm hover:shadow-md">
            <Building2 size={12} />
            {job.employment_type}
          </Badge>
          
          <Badge className="bg-secondary hover:bg-secondary/80 
                           text-secondary-foreground border border-secondary/20
                           hover:border-secondary/40
                           text-xs font-medium px-3 py-1.5 rounded-full
                           transition-all duration-200
                           flex items-center gap-1.5
                           shadow-sm hover:shadow-md">
            <Clock size={12} />
            {job.job_type}
          </Badge>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-6 right-6 h-px 
                        bg-gradient-to-r from-transparent via-border to-transparent
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300" />
      </CardContent>
    </Card>
  )
}

export default NewJobCard
