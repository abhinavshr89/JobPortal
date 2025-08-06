"use client";
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/context/CompanyContext';

function AddCompany() {
  const { user } = useAuth();
  const { hasCompany, setCompany, setHasCompany } = useCompany();
  const userId = user?.id;
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    logo: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if user already has a company
    if (hasCompany) {
      router.push('/add-job');
    }
  }, [hasCompany, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const companyData = { ...formData, ownerId: userId };

    try {
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create company');
      }

      const result = await response.json();
      toast.success('Company created successfully!');
      setFormData({ name: '', description: '', location: '', logo: '' });
      
      // Update context directly
      setCompany(result);
      setHasCompany(true);
      
      router.push('/add-job');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while creating the company.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mx-auto p-6 bg-background shadow-md rounded-md flex flex-col items-center font-poppins justify-center max-md:p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Add Company</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full md:w-[50%]">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary">Name</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-input rounded-md shadow-sm focus:ring-ring focus:border-ring"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-primary">Description</label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-input rounded-md shadow-sm focus:ring-ring focus:border-ring"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-primary">Location</label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-input rounded-md shadow-sm focus:ring-ring focus:border-ring"
          />
        </div>
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-primary">Logo URL</label>
          <Input
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="mt-1 block w-full border-input rounded-md shadow-sm focus:ring-ring focus:border-ring"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding...' : 'Add Company'}
        </button>
      </form>
    </div>
  );
}

export default AddCompany;