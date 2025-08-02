"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

function AddJobPage() {
    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        employment_type: "",
        job_type: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobData({
            ...jobData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setJobData({
            ...jobData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobData),
            });
            // Optionally handle response here
            toast.success("Job added successfully!");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            // Optionally handle error here
            toast.error("Failed to add job");
        }
    };

    return (
        <div className="min-h-screen flex items-center font-poppins justify-center mx-auto mt-8 p-6 border rounded-lg shadow">
            <form className="space-y-4 w-full lg:w-[40%] border  p-3 rounded-md" onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={jobData.title}
                        onChange={handleChange}
                        placeholder="Job Title"
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={jobData.description}
                        onChange={handleChange}
                        placeholder="Job Description"
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        name="location"
                        value={jobData.location}
                        onChange={handleChange}
                        placeholder="Location"
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                        id="salary"
                        name="salary"
                        value={jobData.salary}
                        onChange={handleChange}
                        placeholder="Salary"
                        type="number"
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select
                        value={jobData.employment_type}
                        onValueChange={(value) => handleSelectChange("employment_type", value)}
                    >
                        <SelectTrigger id="employment_type" className='w-full'>
                            <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full_time">Full Time</SelectItem>
                            <SelectItem value="part_time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <Label htmlFor="job_type">Job Type</Label>
                    <Select
                        value={jobData.job_type}
                        onValueChange={(value) => handleSelectChange("job_type", value)}
                    >
                        <SelectTrigger id="job_type" className="w-full">
                            <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="onsite">Onsite</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className='bg-primary-color w-full text-md' type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Job"}
                </Button>
            </form>
        </div>
    );
}

export default AddJobPage;