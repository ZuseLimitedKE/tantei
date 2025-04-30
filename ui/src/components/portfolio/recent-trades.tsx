import { useQuery } from "@tanstack/react-query";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { GetUserTrades } from "@/services/trades";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { TrendingUp, AlertCircle, Database } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { differenceInMinutes } from "date-fns";
export function RecentTrades() {
  const { data: accountId } = useAccountId();
  //fetch data
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
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-8">
            <div className="rounded-full bg-red-100 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Error Loading Recent Activity
            </h3>
            <p className="text-muted-foreground mb-4">
              We encountered an error while retrieving your recent activity.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Please check your connection and try again later.
            </p>
          </div>
        </CardContent>
      </Card>
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

  return (
    <>
      {!trades || trades.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center py-8">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Recent Activity</h3>
              <p className="text-muted-foreground mb-4">
                It looks like you don't have any recent activity.
              </p>
              <p className="text-sm text-muted-foreground">
                This could be because you haven't followed any agents , copied
                any trades , or your portfolio is still being set up.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                        HBAR {trade.type === "buy" ? "purchased" : "sold"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        via {trade.tokenPair} •{" "}
                        {differenceInMinutes(new Date(), trade.time)} mins ago
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">amount:{trade.amount} HBAR</p>
                    <p className="text-xs text-muted-foreground">
                      price: {trade.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
