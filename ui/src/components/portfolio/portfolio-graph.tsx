import PerformanceChart from "../agents/performance-chart";
import { useQuery } from "@tanstack/react-query";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { GetPortfolioGraphData } from "@/services/portfolio";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { LineChart } from "lucide-react";
import { QueryError } from "@/components/tanstack/query-error";
import { EmptyState } from "@/components/tanstack/empty-state";

export function PortfolioGraph() {
  const { data: accountId } = useAccountId();

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
      <QueryError
        title="Error Loading Portfolio Data"
        message="We encountered an error while retrieving your portfolio performance data."
        queryKey={["performance", accountId]}
      />
    );
  }

  if (!performanceData || performanceData.length === 0) {
    return (
      <EmptyState
        title="No Portfolio Performance Data"
        message="It looks like you don't have any portfolio statistics available yet."
        subMessage="This could be because you haven't copied any agent trades, or your portfolio is still being set up."
        icon={<LineChart className="h-8 w-8 text-primary" />}
      />
    );
  }

  return (
    <PerformanceChart data={performanceData} title="Portfolio Performance" />
  );
}
