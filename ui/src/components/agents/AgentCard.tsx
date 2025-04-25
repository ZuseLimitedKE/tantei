import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

import type { AgentData } from "@/services/types";

interface AgentCardProps {
  agent: AgentData;
  compact?: boolean;
}
const agentAvatars = [
  "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?q=80&w=128&auto=format&fit=crop",
];

const AgentCard = ({ agent, compact = false }: AgentCardProps) => {
  // Get a random avatar URL based on the agent's ID or name
  const avatarUrl =
    agentAvatars[Math.floor(Math.random() * agentAvatars.length)];

  // Mock ROI data since it's not in the new interface
  const mockRoi = Math.floor(Math.random() * 40) + 5;
  const isPositiveRoi = mockRoi >= 0;
  const id = agent._id;
  return (
    <Link
      to="/app/agent/$id"
      params={{ id }}
      className="block transition-all duration-200 hover:-translate-y-1"
    >
      <Card
        className={cn("overflow-hidden card-hover", compact ? "h-full" : "")}
      >
        <CardContent className={cn("p-5", compact ? "pb-2" : "")}>
          <div className="flex items-start gap-4 mb-4">
            <div
              className={cn(
                "rounded-full overflow-hidden flex-shrink-0",
                compact ? "w-10 h-10" : "w-12 h-12",
              )}
            >
              <img
                src={avatarUrl}
                alt={agent.agent_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-semibold truncate",
                    compact ? "text-base" : "text-lg",
                  )}
                >
                  {agent.agent_name}
                </h3>
                {agent.risk_level === "low" && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-600 border-blue-200"
                  >
                    <Star className="h-3 w-3 mr-1 fill-blue-500 text-blue-500" />{" "}
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm truncate">
                {agent.strategy_type}
              </p>
            </div>
          </div>

          {!compact && (
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">
              {agent.strategy_description}
            </p>
          )}

          <div
            className={cn(
              "grid gap-4",
              compact ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            <div className="stats-card">
              <p className="text-xs text-muted-foreground mb-1">ROI (30d)</p>
              <div className="flex items-center">
                {isPositiveRoi ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={cn(
                    "text-base font-medium",
                    isPositiveRoi ? "text-green-500" : "text-red-500",
                  )}
                >
                  {isPositiveRoi ? "+" : ""}
                  {mockRoi}%
                </span>
              </div>
            </div>

            <div className="stats-card">
              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-base font-medium capitalize">
                  {agent.risk_level || "Moderate"}
                </span>
              </div>
            </div>

            {!compact && (
              <div className="stats-card">
                <p className="text-xs text-muted-foreground mb-1">
                  Monthly Fee
                </p>
                <span className="text-base font-medium">
                  {agent.subscription_fee} HBAR
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter
          className={cn(
            "px-5 py-3 bg-muted/30 flex justify-between",
            compact ? "mt-2" : "mt-5",
          )}
        >
          <div className="text-sm text-muted-foreground">
            By {agent.owner_wallet_address.slice(0, 6)}...
            {agent.owner_wallet_address.slice(-4)}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary font-medium"
          >
            View Agent <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AgentCard;
