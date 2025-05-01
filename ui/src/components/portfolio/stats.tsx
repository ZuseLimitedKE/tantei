import { useQuery } from "@tanstack/react-query";
import { GetPortfolioStats } from "@/services/portfolio";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { Card, CardContent } from "../ui/card";
import { TrendingUp, PieChart, Clock } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";
import { differenceInMinutes } from "date-fns";
import { QueryError } from "../tanstack/query-error";
import { EmptyState } from "../tanstack/empty-state";

export function PortfolioStats() {
  const { data: accountId } = useAccountId();
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["portfolio-stats", accountId],
    queryFn: () => GetPortfolioStats(accountId),
    refetchInterval: 30000,
  });

  if (isError) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8">
        <QueryError
          queryKey={["portfolio-stats", accountId]}
          title="Error Loading Portfolio Stats Data"
          message="We encountered an error while retrieving your portfolio statistics."
          subMessage="Please check your connection and try again later. If the problem persists, contact support."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 h-56">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="bg-gray-100 p-6 rounded-xl border py-6"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8">
        <EmptyState
          title="No Portfolio Data"
          message="It looks like you don't have any portfolio statistics available yet."
          subMessage="This could be because you haven't made any trades, or your portfolio is still being set up."
          icon={<Database className="h-8 w-8 text-primary" />}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-blue-100 p-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-muted-foreground">Total ROI</h3>
              <p
                className={cn(
                  "text-2xl font-bold",
                  stats.roi > 0 ? "text-green-500" : "text-red-500",
                )}
              >
                {stats.roi > 0 ? "+" : ""} {stats.roi}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-green-100 p-2">
              <PieChart className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-muted-foreground">
                Portfolio Value
              </h3>
              <p className="text-2xl font-bold">{stats.value}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-amber-100 p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-muted-foreground">Last Trade</h3>
              <p className="text-2xl font-bold">
                {stats.last_trade
                  ? differenceInMinutes(new Date(), stats.last_trade) +
                  " mins ago"
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
