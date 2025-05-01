import PerformanceChart from "../agents/performance-chart";
import { useQuery } from "@tanstack/react-query";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { GetPortfolioGraphData } from "@/services/portfolio";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, LineChart } from "lucide-react";

export function PortfolioGraph() {
  const { data: accountId } = useAccountId();

  // Fetch data
  const {
    data: rawPerformanceData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["performance", accountId],
    queryFn: () => GetPortfolioGraphData(accountId),
    refetchInterval: 30000,
    enabled: !!accountId,
  });

  // Transform data to match PerformanceChart expected format
  const performanceData = rawPerformanceData?.map((item) => ({
    date: item.time.split("T")[0], // Extract YYYY-MM-DD from ISO string
    value: item.value,
  }));

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-8">
            <div className="rounded-full bg-red-100 p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Error Loading Portfolio Data
            </h3>
            <p className="text-muted-foreground mb-4">
              We encountered an error while retrieving your portfolio
              performance data.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Please check your connection and try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!performanceData || performanceData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <LineChart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              No Portfolio Performance Data
            </h3>
            <p className="text-muted-foreground mb-4">
              It looks like you don't have any portfolio statistics available
              yet.
            </p>
            <p className="text-sm text-muted-foreground">
              This could be because you haven't copied any agent trades, or your
              portfolio is still being set up.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <PerformanceChart data={performanceData} title="Portfolio Performance" />
  );
}
