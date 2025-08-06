"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock, Building, ArrowLeft } from 'lucide-react';
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
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/job/${params.id}`);
        
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

    if (params.id) {
      fetchJobDetails();
    }
  }, [params.id]);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatEmploymentType = (type: string) => {
    return type.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-600 text-lg mb-4">{error || 'Job not found'}</div>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button 
          onClick={() => router.push('/')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">{job.company.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 text-2xl font-bold mb-2">
                  <DollarSign className="w-6 h-6" />
                  {formatSalary(job.salary)}
                </div>
                <div className="text-gray-500">per year</div>
              </div>
            </div>

            {/* Job Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatEmploymentType(job.employment_type)}
              </Badge>
              <Badge variant="outline">
                {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Company Information */}
          <div className="mb-8 border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About {job.company.name}</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">{job.company.description}</p>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Located in {job.company.location}</span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="border-t pt-8">
            <Button 
              className="w-full bg-primary-color hover:bg-primary-color/90 text-white py-3 text-lg"
              onClick={() => toast.success('Application feature coming soon!')}
            >
              Apply for this Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
