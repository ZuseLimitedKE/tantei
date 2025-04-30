import { createFileRoute, Link } from "@tanstack/react-router";
// import {
//   generateMockTradeHistory,
//   generatePerformanceData,
// } from "@/services/mockData";
//import PerformanceChart from "@/components/agents/PerformanceChart";
import TradeHistoryTable from "@/components/agents/TradeHistoryTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Star,
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAgentDetails, fetchAgentTrades/*, fetchAgentPerformance*/ } from "@/services/agents";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/app/agent/$id")({
  component: AgentDetailComponent,
});

function AgentDetailComponent() {
  const { id } = Route.useParams();

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', id],
    queryFn: () => fetchAgentDetails(id),
  });

  const { data: trades } = useQuery({
    queryKey: ['trades', id],
    queryFn: () => fetchAgentTrades(id),
  });
  
  // Fetch performance data
  // const { data: performance } = useQuery({
  //   queryKey: ['performance', id],
  //   queryFn: () => fetchAgentPerformance(id),
  // });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container px-4 py-8 mx-auto">
          <div className="max-w-screen-xl mx-auto space-y-6">
            <Skeleton className="h-12 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container px-4 py-8 mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <p className="mb-6">
            The agent you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/app/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </main>
      </div>
    );
  }

  // const tradeHistory = generateMockTradeHistory(agent._id);
  // const performanceData = generatePerformanceData(90);

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8 mx-auto">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-6">
            <Link
              to="/app/marketplace"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Marketplace
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{agent.agent_name}</h1>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-200"
                    >
                      <Star className="h-3 w-3 mr-1 fill-blue-500 text-blue-500" />{" "}
                      Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{agent.strategy_type}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="cursor-pointer">Follow Agent</Button>
                <Button className="cursor-pointer">Start Copying Trades</Button>
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Metric Cards */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">ROI (30d)</h3>
                    {/* <p
                      className={`text-2xl font-bold ${isPositiveRoi ? "text-green-500" : "text-red-500"}`}
                    >
                      {isPositiveRoi ? "+" : ""}
                      {mockRoi}%
                    </p> */}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Historical return based on all trades in the last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-orange-100 p-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Risk Level</h3>
                    <p className="text-2xl font-bold">{agent.risk_level}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on volatility, max drawdown, and asset diversity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Followers</h3>
                    <p className="text-2xl font-bold">{agent.num_followers.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Traders actively copying this agent's strategy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3">About This Strategy</h2>
                <p className="text-muted-foreground mb-4">
                  {agent.strategy_description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Average Trade Duration
                      </p>
                      <p className="font-medium">2-3 days</p>
                    </div>
                  </div>

                <TooltipProvider>
                  <div className="flex items-center gap-3">
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <p>The peak-to-trough decline of the asset price over a certain timeframe.</p>
                      </TooltipContent>
                    </Tooltip>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Drawdown</p>
                      <p className="font-medium">12.4%</p>
                    </div>
                  </div>
                </TooltipProvider>
                
                <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Subscription Fee</p>
                      <p className="font-medium">{agent.subscription_fee} HBAR/month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Trades
                      </p>
                      {/*Find A way to get this data*/}
                      <p className="font-medium">100</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          {/* <div className="mb-8">
            <PerformanceChart
              data={performanceData}
              title="Performance History"
            />
          </div>

          {/* Trade History */}
          <div className="mb-8">
            <TradeHistoryTable trades={trades || []} />
          </div> 

          {/* CTA Section */}
          <div className="text-center my-10">
            <h2 className="text-2xl font-bold mb-4">
              Ready to start copying this agent?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Connect your wallet and set up automated trading with{" "}
              {agent.agent_name}. You'll be able to customize risk levels and
              maximum exposure.
            </p>
            <Button size="lg" className="px-8 cursor-pointer">
              Start Copying Trades
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
