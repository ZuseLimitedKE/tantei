import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import AgentCard from "@/components/agents/AgentCard";
// import {
//   getPerformanceScore,
//   getAgentAge,
//   getPopularityScore,
//   getRiskScore,
// } from "@/services/mockData";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/services/agents";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";


export const Route = createFileRoute("/app/marketplace")({
  component: MarketplaceComponent,
});

function MarketplaceComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("performance");

  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  //search and filter handlers
  const handleSearch = (term: string) => setSearchTerm(term);
  const handleFilterChange = (filters: string[]) => setActiveFilters(filters);
  const handleSortChange = (value: string) => setSortBy(value);
  
  const filteredAgents = useMemo(() => {
    if (!agents) return [];
    
    let filtered = [...agents];

  // Search filter
  if (searchTerm) {
    const nameMatches = filtered.filter(agent => 
      agent.agent_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    
    const strategyMatches = filtered.filter(agent => 
      !agent.agent_name.toLowerCase().startsWith(searchTerm.toLowerCase()) && // exclude name matches
      agent.strategy_type.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    
    filtered = [...nameMatches, ...strategyMatches];
  }

    // Tag filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(agent => {
        const agentTags = [
          agent.strategy_type,
          agent.risk_level,
          agent.subscription_fee === 0 ? 'Free To Follow' : ''
        ];
        return activeFilters.some(filter => agentTags.includes(filter));
      });
    }

    // // Sorting
    // switch (sortBy) {
    //   case "performance":
    //     filtered.sort((a, b) => b.performance.roi_30d - a.performance.roi_30d);
    //     break;
    //   case "popularity":
    //     filtered.sort((a, b) => b.followers - a.followers);
    //     break;
    //   case "newest":
    //     filtered.sort((a, b) => 
    //       new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    //     );
    //     break;
    //   case "risk-low":
    //     filtered.sort((a, b) => a.risk_level.localeCompare(b.risk_level));
    //     break;
    //   case "risk-high":
    //     filtered.sort((a, b) => b.risk_level.localeCompare(a.risk_level));
    //     break;
    // }

    return filtered;
  }, [agents, searchTerm, activeFilters, /*sortBy*/]);

  // Loading and error states
  if (isLoading) return <SkeletonGrid />;
  if (error) return <ErrorAlert error={error} />;

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

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
    ))}
  </div>
);

const ErrorAlert = ({ error }: { error: Error }) => (
  <Alert variant="destructive">
    <ExclamationTriangleIcon className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {error.message || "Failed to load agents"}
    </AlertDescription>
  </Alert>
);
