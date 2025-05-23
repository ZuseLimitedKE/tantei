import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BASEHOST } from "@/integrations/basehost";

import { createFileRoute, Link } from "@tanstack/react-router";
import PerformanceChart from "@/components/agents/PerformanceChart";
import TradeHistoryTable from "@/components/agents/TradeHistoryTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  fetchAgentDetails,
  fetchAgentTrades,
  fetchAgentPerformance,
} from "@/services/agents";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type HederaSignerType,
  type HWBridgeSigner,
  useAccountId,
  useWallet,
} from "@buidlerlabs/hashgraph-react-wallets";
import { TransferTransaction, Hbar } from "@hashgraph/sdk";
export const Route = createFileRoute("/app/agent/$id")({
  component: AgentDetailComponent,
});

function AgentDetailComponent() {
  const { id } = Route.useParams();

  const [isCopying, setIsCopying] = useState(false);
  const { data: accountId } = useAccountId();
  const { isConnected, signer } = useWallet();
  function isHederaSigner(signer: HWBridgeSigner): signer is HederaSignerType {
    // Check based on properties that are unique to HederaSignerType
    return (signer as HederaSignerType).topic !== undefined;
  }
  const handleCopyTrades = async () => {
    if (!agent) return;

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!signer) {
      toast.error("Wallet not connected");
      return;
    }
    if (!isHederaSigner(signer)) {
      toast.error("Invalid signer");
      return;
    }
    try {
      const response = await axios.post(`${BASEHOST}/api/v1/users/follow`, {
        user_hedera_account: accountId,
        agent_hedera_account: agent.address,
      });
      if (response.status === 201 || response.status === 200) {
        const amountResponse = await axios.get(
          `${BASEHOST}/api/v1/agents/address/${agent.address}`,
        );

        if (amountResponse.status === 201 || amountResponse.status === 200) {
          const amount = amountResponse.data?.subscription_fee;
          console.log("amount=>", amount);
          console.log("|AccountId=> ", accountId);
          const transferTokenTx = new TransferTransaction()
            .addHbarTransfer(accountId, new Hbar(-1))
            .addHbarTransfer("0.0.5805516", new Hbar(1));
          console.log("transfer hbra tx=>", transferTokenTx);
          const signedTx = await transferTokenTx.freezeWithSigner(signer);
          const result = await signedTx.executeWithSigner(signer);
          console.log(
            "Transfer of coinst transaction executed =>",
            result.transactionId.toString(),
          );
          toast.success("Agent copied successfully");
          setIsCopying(false);
          return;
        } else {
          toast.error("Error occured while copying");
          setIsCopying(false);
          return;
        }
      } else {
        toast.error("Error occured while copying");
        setIsCopying(false);
        return;
      }
    } catch (error) {
      console.log("Error occured while copying: ", error);
      toast.error("Error occured while copying");
      setIsCopying(false);
    }
    setIsCopying(false);
    return;
  };

  const { data: agent, isLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => fetchAgentDetails(id),
  });

  const { data: tradesData } = useQuery({
    queryKey: ["trades", id],
    queryFn: () => fetchAgentTrades(id),
  });

  // Fetch performance data
  const { data: performance } = useQuery({
    queryKey: ["performance", id],
    queryFn: () => fetchAgentPerformance(id),
  });

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
                <Button variant="outline" className="cursor-pointer" asChild>
                  <a
                    href={`https://hashscan.io/testnet/topic/${agent.topic_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check Agent Topic
                  </a>
                </Button>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className="inline-block cursor-pointer">
                        {" "}
                        {/* Wrapper for tooltip positioning */}
                        <Button
                          size="lg"
                          className="px-8 cursor-pointer"
                          onClick={handleCopyTrades}
                          disabled={isCopying || !isConnected}
                        >
                          {isCopying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Start Copying Trades"
                          )}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isConnected && (
                      <TooltipContent
                        side="top"
                        className="bg-foreground text-background"
                      >
                        <p>Please connect your wallet first</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
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
                    <p
                      className={`text-2xl font-bold ${agent.roi >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {agent.roi >= 0 ? "+" : ""}
                      {agent.roi.toFixed(2)}%
                    </p>
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
                    <p className="text-2xl font-bold">
                      {agent.num_followers.toLocaleString()}
                    </p>
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
                          <p>
                            The peak-to-trough decline of this agent asset's
                            price since its date of publish.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Max Drawdown
                        </p>
                        <p className="font-medium">{agent.drawdown} %</p>
                      </div>
                    </div>
                  </TooltipProvider>

                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Subscription Fee
                      </p>
                      <p className="font-medium">
                        {agent.subscription_fee} HBAR/month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Trades
                      </p>
                      {/*Find A way to get this data*/}
                      <p className="font-medium">{tradesData?.total_trades}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          {performance && (
            <div className="mb-8">
              <PerformanceChart
                data={performance}
                title="Performance History"
              />
            </div>
          )}

          {/* Trade History */}
          <div className="mb-8">
            <TradeHistoryTable
              data={tradesData || { trades: [], total_trades: 0 }}
            />
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
            <Button
              size="lg"
              className="px-8 cursor-pointer"
              onClick={handleCopyTrades}
              disabled={isCopying || !isConnected}
            >
              {isCopying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Start Copying Trades"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
