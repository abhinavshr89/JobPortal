"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, DollarSign, Clock, Building, ArrowLeft, Briefcase, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  employment_type: string;
  job_type: string;
  company: {
    id: string;
    name: string;
    description: string;
    location: string;
    logo?: string;
  };
}

function JobDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('id');
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError('Job ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/job/${jobId}`);
        
        if (response.ok) {
          const jobData = await response.json();
          setJob(jobData);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch job details');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatEmploymentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatJobType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive text-lg font-semibold mb-4">
              {error || 'Job not found'}
            </div>
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          onClick={() => router.push('/')} 
          variant="outline" 
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        {/* Main Job Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-2 text-foreground">
                  {job.title}
                </CardTitle>
                <div className="flex items-center text-muted-foreground mb-3">
                  <Building className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">{job.company.name}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>
              </div>
              
              <div className="lg:text-right">
                <div className="flex items-center text-2xl font-bold text-primary mb-1">
                  <DollarSign className="w-6 h-6" />
                  {formatSalary(job.salary)}
                </div>
                <p className="text-sm text-muted-foreground">per year</p>
              </div>
            </div>

            {/* Job Type Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatEmploymentType(job.employment_type)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {formatJobType(job.job_type)}
              </Badge>
            </div>
          </CardHeader>

          <Separator className="mx-6" />

          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-foreground">Job Description</h2>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Company Information */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-foreground">
                  About {job.company.name}
                </h2>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {job.company.description}
                    </p>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Located in {job.company.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Job Details Grid */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-foreground">Job Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm text-muted-foreground">Employment Type</span>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatEmploymentType(job.employment_type)}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm text-muted-foreground">Work Type</span>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatJobType(job.job_type)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apply Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ready to apply?</h3>
              <p className="text-muted-foreground text-sm">
                Take the next step in your career journey
              </p>
              <Button 
                className="w-full lg:w-auto lg:px-8"
                size="lg"
                onClick={() => toast.success('Application feature coming soon!')}
              >
                Apply for this Position
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default JobDetailsPage;