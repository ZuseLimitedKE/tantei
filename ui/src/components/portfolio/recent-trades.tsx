import { useQuery } from "@tanstack/react-query";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { GetUserTrades } from "@/services/trades";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { TrendingUp, Database } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { differenceInMinutes } from "date-fns";
import { QueryError } from "../tanstack/query-error";
import { EmptyState } from "../tanstack/empty-state";
export function RecentTrades() {
  const { data: accountId } = useAccountId();

  const {
    data: trades,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["trades", accountId],
    queryFn: () => GetUserTrades(accountId),
    refetchInterval: 30000,
    enabled: !!accountId,
  });

  if (isError) {
    return (
      <QueryError
        queryKey={["trades", accountId]}
        title="Error Loading Recent Activity"
        message="We encountered an error while retrieving your recent activity."
        subMessage="Please check your connection and try again later."
      />
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <EmptyState
        title="No Recent Activity"
        message="It looks like you don't have any recent activity."
        subMessage="This could be because you haven't followed any agents, copied any trades, or your portfolio is still being set up."
        icon={<Database className="h-8 w-8 text-primary" />}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Trading Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {trades.map((trade, index) => (
            <div
              key={index}
              className="flex items-start justify-between pb-4 border-b"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-1.5 mt-0.5">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {trade.tokenPair}{" "}
                    {trade.type === "buy" ? "purchased" : "sold"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    via {trade.tokenPair} •{" "}
                    {differenceInMinutes(new Date(), trade.time)} mins ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">amount received: {trade.amount}</p>
                <p className="text-xs text-muted-foreground">
                  price per token: {trade.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
