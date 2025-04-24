// src/routes/app/marketplace.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import AgentCard from "@/components/agents/AgentCard";
import { mockAgents } from "@/services/mockData";

export const Route = createFileRoute("/app/marketplace")({
  component: MarketplaceComponent,
});

function MarketplaceComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("performance");

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleFilterChange = (filters: string[]) => setActiveFilters(filters);
  const handleSortChange = (value: string) => setSortBy(value);

  const filteredAgents = useMemo(() => {
    let filtered = [...mockAgents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.strategyType.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Tag filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((agent) => {
        const agentTags = [
          agent.strategyType,
          `${agent.riskScore <= 3 ? "Low Risk" : agent.riskScore <= 6 ? "Medium Risk" : "High Risk"}`,
          agent.verified ? "Verified Only" : "",
        ];
        return activeFilters.some((filter) => agentTags.includes(filter));
      });
    }

    // Additional sorting
    switch (sortBy) {
      case "performance":
        filtered.sort((a, b) => b.roi - a.roi);
        break;
      case "popularity":
        filtered.sort((a, b) => b.followers - a.followers);
        break;
      case "newest":
        filtered.sort((a, b) => b.trades - a.trades);
        break;
      case "risk-low":
        filtered.sort((a, b) => a.riskScore - b.riskScore);
        break;
      case "risk-high":
        filtered.sort((a, b) => b.riskScore - a.riskScore);
        break;
    }

    return filtered;
  }, [searchTerm, activeFilters, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <main className=" px-4 py-8 mx-auto">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Find Your Trading Edge
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover and follow AI-powered trading agents built for the Hedera
              ecosystem
            </p>
          </div>

          <MarketplaceFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            currentSort={sortBy}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
