import { useQuery } from "@tanstack/react-query";
import { GetFollowedAgents } from "@/services/agents";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { Skeleton } from "../ui/skeleton";
import { Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import AgentCard from "../agents/AgentCard";
import { Card } from "../ui/card";
import { EmptyState } from "../tanstack/empty-state";
import { QueryError } from "../tanstack/query-error";
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
export function FollowedAgentsList() {
  const { data: accountId } = useAccountId();
  const {
    data: followedAgents,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["followed-agents", accountId],
    queryFn: () => GetFollowedAgents(accountId),
    refetchInterval: 30000,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-6" />
            <Skeleton className="h-20 w-full rounded-md mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-6">
        <QueryError
          queryKey={["followed-agents", accountId]}
          title="Error Loading Agents"
          message="We encountered an error while retrieving your followed agents."
          subMessage="Please check your connection and try again later."
          buttonText="Try Again"
          className="md:col-span-3"
        />
      </div>
    );
  }

  // Empty state
  if (!followedAgents || followedAgents.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-6">
        <EmptyState
          title="No Followed Agents"
          message="You haven't followed any AI agents yet."
          subMessage="Follow some agents to start building your portfolio and track their performance."
          icon={<Users className="h-8 w-8 text-primary" />}
          className="md:col-span-3"
          actionButton={
            <Link
              to="/app/marketplace"
              className="bg-primary text-sm h-8 flex items-center justify-center text-white rounded-md px-4 py-2 font-semibold"
            >
              Browse Marketplace
            </Link>
          }
        />
      </div>
    );
  }

  // Data loaded successfully
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {followedAgents.map((agent) => (
        <AgentCard key={agent._id} agent={agent} />
      ))}
      <Card className="flex flex-col items-center justify-center border-dashed p-6 h-full min-h-[300px]">
        <div className="mb-4 rounded-full bg-muted p-4">
          <PlusIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Add More Agents</h3>
        <p className="text-sm text-center text-muted-foreground mb-4">
          Discover more AI agents to follow and diversify your portfolio
        </p>
        <Link
          to="/app/marketplace"
          className="bg-primary text-sm h-8 flex items-center justify-center text-white rounded-md px-4 py-2 font-semibold"
        >
          Browse Marketplace
        </Link>
      </Card>
    </div>
  );
}
