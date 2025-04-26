import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import AgentCard from "@/components/agents/AgentCard";
import {
  mockAgents,
  getPerformanceScore,
  getAgentAge,
  getPopularityScore,
  getRiskScore,
} from "@/services/mockData";

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
          agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.strategy_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          agent.strategy_type.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Tag filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((agent) => {
        // Check if any of the agent's properties match any of the active filters
        return activeFilters.some((filter) => {
          // Check for risk level
          if (filter === "low" || filter === "medium" || filter === "high") {
            return agent.risk_level === filter;
          }

          // Check for strategy type
          if (filter === agent.strategy_type) {
            return true;
          }

          // Check for free agents
          if (filter === "Free To Follow" && agent.subscription_fee === 0) {
            return true;
          }

          // For "New Agents" we would check creation date - here we use mock data
          if (filter === "New Agents" && getAgentAge(agent._id || "") < 30) {
            return true;
          }

          return false;
        });
      });
    }

    // Additional sorting
    switch (sortBy) {
      case "performance":
        filtered.sort((a, b) => {
          const perfA = getPerformanceScore(a._id || "");
          const perfB = getPerformanceScore(b._id || "");
          return perfB - perfA;
        });
        break;
      case "popularity":
        filtered.sort((a, b) => {
          const popA = getPopularityScore(a._id || "");
          const popB = getPopularityScore(b._id || "");
          return popB - popA;
        });
        break;
      case "newest":
        filtered.sort((a, b) => {
          const ageA = getAgentAge(a._id || "");
          const ageB = getAgentAge(b._id || "");
          return ageA - ageB; // Lower age means newer
        });
        break;
      case "risk-low":
        filtered.sort((a, b) => {
          const riskA = getRiskScore(a.risk_level);
          const riskB = getRiskScore(b.risk_level);
          return riskA - riskB;
        });
        break;
      case "risk-high":
        filtered.sort((a, b) => {
          const riskA = getRiskScore(a.risk_level);
          const riskB = getRiskScore(b.risk_level);
          return riskB - riskA;
        });
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
              <AgentCard key={agent._id} agent={agent} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
