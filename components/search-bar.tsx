import React, { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { suggestJobs } from "@/action/job.action";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    const getSuggestions = async () => {
      if (debouncedQuery.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const data = await suggestJobs(debouncedQuery);

        if (data.success) {
          setSuggestions(data.suggestions ?? []);
        } else {
          console.error("Failed to fetch suggestions:", data.message);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching job suggestions:", error);
        setSuggestions([]);
      }
    };
    getSuggestions();
  }, [debouncedQuery]);

  const handleClick = () => {
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div className="flex flex-1 max-w-[600px] items-center bg-muted rounded-full px-3 py-1 shadow-inner border border-border mx-4 min-w-[220px] relative">
      <input
        type="text"
        className="bg-transparent border-none outline-none text-lg px-2 py-1 text-card-foreground placeholder:text-muted-foreground flex-1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Search jobs..."
      />
      <button
        onClick={handleClick}
        className="rounded-full p-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-150 text-muted-foreground"
        disabled={!searchQuery.trim()}
      >
        <SearchIcon size={18} />
      </button>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 hover:bg-muted transition-colors duration-150 cursor-pointer text-card-foreground"
              onClick={() => {
                setSearchQuery(suggestion.title);
                setSuggestions([]);
                router.push(`/?q=${encodeURIComponent(suggestion.title)}`);
              }}
            >
              {suggestion.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;