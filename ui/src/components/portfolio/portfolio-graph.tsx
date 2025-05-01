import PerformanceChart from "../agents/performance-chart";
import { useQuery } from "@tanstack/react-query";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { GetPortfolioGraphData } from "@/services/portfolio";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle } from "lucide-react";
import { IconGraph } from "@tabler/icons-react";
export function PortfolioGraph() {
  const { data: accountId } = useAccountId();
  //fetch data
  const {
    data: performanceData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["performance", accountId],
    queryFn: () => GetPortfolioGraphData(accountId),
    refetchInterval: 30000,
    enabled: !!accountId,
  });
  // Error state
  if (isError) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center py-8">
              <div className="rounded-full bg-red-100 p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Error Portfolio Graph
              </h3>
              <p className="text-muted-foreground mb-4">
                We encountered an error while retrieving your portfolio data.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Please check your connection and try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-full w-full" />
      </Card>
    );
  }
  return (
    <>
      {!performanceData || performanceData.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center py-8">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <IconGraph className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                No Portfolio Performance Data
              </h3>
              <p className="text-muted-foreground mb-4">
                It looks like you don't have any portfolio statistics available
                yet.
              </p>
              <p className="text-sm text-muted-foreground">
                This could be because you haven't copied any agent trades, or
                your portfolio is still being set up.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <PerformanceChart
          data={performanceData}
          title="Portfolio Performance"
        />
      )}
    </>
  );
}
