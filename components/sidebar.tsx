"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, DollarSign } from "lucide-react";

function SideBar() {
  const [filters, setFilters] = useState({
    employmentType: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRadioChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // params --> apna key value jod diya -> q : ksadkfj, minSalary: 1000, maxSalary: 5000
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({
      employmentType: "",
      jobType: "",
      minSalary: "",
      maxSalary: "",
    });
  
  };

  return (
    <div className="font-poppins max-md:hidden w-[20%] fixed mt-[95px] bg-card border border-border text-card-foreground p-6 rounded-xl shadow-md min-h-[400px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-muted-foreground" />
        <h2 className="text-lg font-medium text-card-foreground">Filter Jobs</h2>
      </div>

      {/* Employment Type */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-muted-foreground mb-3 block">
          Employment Type
        </Label>
        <RadioGroup 
          value={filters.employmentType} 
          onValueChange={v => handleRadioChange("employmentType", v)} 
          className="space-y-2"
        >
          {[
            { value: "full_time", label: "Full Time" },
            { value: "part_time", label: "Part Time" },
            { value: "contract", label: "Contract" },
            { value: "internship", label: "Internship" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-3 group">
              <RadioGroupItem 
                value={option.value} 
                id={`employment-${option.value}`} 
                className="w-4 h-4 border-border text-primary"
              />
              <Label 
                htmlFor={`employment-${option.value}`} 
                className="text-sm text-muted-foreground cursor-pointer group-hover:text-card-foreground transition-colors"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-muted-foreground mb-3 block">
          Work Mode
        </Label>
        <RadioGroup 
          value={filters.jobType} 
          onValueChange={v => handleRadioChange("jobType", v)} 
          className="space-y-2"
        >
          {[
            { value: "onsite", label: "On-site" },
            { value: "remote", label: "Remote" },
            { value: "hybrid", label: "Hybrid" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-3 group">
              <RadioGroupItem 
                value={option.value} 
                id={`jobtype-${option.value}`} 
                className="w-4 h-4 border-border text-primary"
              />
              <Label 
                htmlFor={`jobtype-${option.value}`} 
                className="text-sm text-muted-foreground cursor-pointer group-hover:text-card-foreground transition-colors"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Salary Range */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={16} className="text-muted-foreground" />
          <Label className="text-sm font-medium text-muted-foreground">
            Salary Range
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              id="minSalary"
              name="minSalary"
              type="number"
              value={filters.minSalary}
              onChange={handleInputChange}
              placeholder="Min"
              className="bg-muted border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 text-sm h-9"
            />
          </div>
          <div>
            <Input
              id="maxSalary"
              name="maxSalary"
              type="number"
              value={filters.maxSalary}
              onChange={handleInputChange}
              placeholder="Max"
              className="bg-muted border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 text-sm h-9"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-8">
        <Button 
          onClick={handleApplyFilters}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground border-0 h-10 text-sm font-medium transition-colors"
        >
          Apply Filters
        </Button>
        {/* If you want to add back the Clear All button, use semantic colors as well:
        <Button 
          onClick={handleClearFilters}
          variant="outline"
          className="w-full bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-card-foreground h-10 text-sm transition-colors"
        >
          Clear All
        </Button>
        */}
      </div>
    </div>
  );
}

export default SideBar;
