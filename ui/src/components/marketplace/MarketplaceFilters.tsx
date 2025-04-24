import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface FiltersProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  onSortChange: (sort: string) => void;
  currentSort: string;
}

const MarketplaceFilters = ({ onSearch, onFilterChange, onSortChange, currentSort }: FiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      const newFilters = [...activeFilters, filter];
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    }
  };
  
  const removeFilter = (filter: string) => {
    const newFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search agents by name or strategy..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
          />
        </form>
        
        <div className="flex gap-3">
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="risk-low">Risk (Low-High)</SelectItem>
              <SelectItem value="risk-high">Risk (High-Low)</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Agents</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Strategy Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Swing Trading", "Scalping", "Arbitrage", "Trend Following", "DeFi Yield"].map((strategy) => (
                      <Badge 
                        key={strategy}
                        variant={activeFilters.includes(strategy) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => activeFilters.includes(strategy) 
                          ? removeFilter(strategy) 
                          : addFilter(strategy)
                        }
                      >
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Time Period</h3>
                  <div className="flex flex-wrap gap-2">
                    {["24h", "7d", "30d", "90d", "1y", "All Time"].map((period) => (
                      <Badge 
                        key={period}
                        variant={activeFilters.includes(period) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => activeFilters.includes(period) 
                          ? removeFilter(period) 
                          : addFilter(period)
                        }
                      >
                        {period}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Risk Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Low Risk", "Medium Risk", "High Risk"].map((risk) => (
                      <Badge 
                        key={risk}
                        variant={activeFilters.includes(risk) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => activeFilters.includes(risk) 
                          ? removeFilter(risk) 
                          : addFilter(risk)
                        }
                      >
                        {risk}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Other</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Verified Only", "Free To Follow", "New Agents"].map((filter) => (
                      <Badge 
                        key={filter}
                        variant={activeFilters.includes(filter) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => activeFilters.includes(filter) 
                          ? removeFilter(filter) 
                          : addFilter(filter)
                        }
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveFilters([]);
                    onFilterChange([]);
                  }}
                >
                  Clear All
                </Button>
                <Button>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(filter => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter(filter)} 
              />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6" 
            onClick={() => {
              setActiveFilters([]);
              onFilterChange([]);
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarketplaceFilters;
