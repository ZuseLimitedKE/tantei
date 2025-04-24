
import { Link } from "@tanstack/react-router";
import { ChevronRight, Star, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AgentData {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  strategyType: string;
  roi: number;
  roiTimeframe: string;
  riskScore: number;
  followers: number;
  trades: number;
  verified: boolean;
}

interface AgentCardProps {
  agent: AgentData;
  compact?: boolean;
}

const AgentCard = ({ agent, compact = false }: AgentCardProps) => {
  const { id, name, avatarUrl, description, strategyType, roi, roiTimeframe, riskScore, followers, trades, verified } = agent;
  
  const isPositiveRoi = roi >= 0;

  return (
    <Link to="/app/agent/$id" params={{ id }} className="block transition-all duration-200 hover:-translate-y-1">
      <Card className={cn("overflow-hidden card-hover cursor-pointer", compact ? "h-full" : "")}>
        <CardContent className={cn("p-5", compact ? "pb-2" : "")}>
          <div className="flex items-start gap-4 mb-4">
            <div className={cn("rounded-full overflow-hidden flex-shrink-0", compact ? "w-10 h-10" : "w-12 h-12")}>
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={cn("font-semibold truncate", compact ? "text-base" : "text-lg")}>{name}</h3>
                {verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    <Star className="h-3 w-3 mr-1 fill-blue-500 text-blue-500" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm truncate">{strategyType}</p>
            </div>
          </div>
          
          {!compact && (
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{description}</p>
          )}
          
          <div className={cn("grid gap-4", compact ? "grid-cols-2" : "grid-cols-3")}>
            <div className="stats-card">
              <p className="text-xs text-muted-foreground mb-1">ROI {roiTimeframe}</p>
              <div className="flex items-center">
                {isPositiveRoi ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={cn("text-base font-medium", isPositiveRoi ? "text-green-500" : "text-red-500")}>
                  {isPositiveRoi ? "+" : ""}{roi}%
                </span>
              </div>
            </div>
            
            <div className="stats-card">
              <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-base font-medium">{riskScore}/10</span>
              </div>
            </div>
            
            {!compact && (
              <div className="stats-card">
                <p className="text-xs text-muted-foreground mb-1">Followers</p>
                <span className="text-base font-medium">{followers.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className={cn("px-5 py-3 bg-muted/30 flex justify-between", compact ? "mt-2" : "mt-5")}>
          <div className="text-sm text-muted-foreground">{trades} trades</div>
          <div className="text-primary font-medium flex items-center">
            View Agent <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AgentCard;
