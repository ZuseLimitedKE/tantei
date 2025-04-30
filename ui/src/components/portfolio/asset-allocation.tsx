import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { GetTokenAllocation } from "@/services/tokens";
import { useAccountId } from "@buidlerlabs/hashgraph-react-wallets";
import { AlertCircle, Wallet, PieChart } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

// array of Tailwind colors for the asset allocation bars
const ASSET_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

export function AssetAllocation() {
  const { data: accountId } = useAccountId();
  const [view, setView] = useState<"percentage" | "value">("percentage");
  //fetch data
  const {
    data: tokens,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["tokens", accountId],
    queryFn: () => GetTokenAllocation(accountId),
    refetchInterval: 30000,
    enabled: !!accountId,
  });
  //gets the total value of the tokens
  const calculateTotalValue = () => {
    if (!tokens || tokens.length === 0) return 0;
    return tokens.reduce((total, token) => total + token.balance, 0);
  };
  //generates the percentage of a given token
  const generateAllocationPercentage = (amount: number): number => {
    const total = calculateTotalValue();
    if (total) {
      return (amount / total) * 100;
    }
    return 0;
  };

  const formatBalance = (balance: number) => {
    // format large numbers with commas
    return balance.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
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
            <h3 className="text-xl font-medium mb-2">Error Loading Assets</h3>
            <p className="text-muted-foreground mb-4">
              We encountered an error while retrieving your asset allocation.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Please check your connection and try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Asset Allocation
          </CardTitle>

          <div className="inline-flex items-center rounded-md bg-muted p-1 text-xs">
            <button
              onClick={() => setView("percentage")}
              className={`px-2 py-1 rounded ${view === "percentage" ? "bg-background shadow" : ""
                }`}
            >
              Percentage
            </button>
            <button
              onClick={() => setView("value")}
              className={`px-2 py-1 rounded ${view === "value" ? "bg-background shadow" : ""
                }`}
            >
              Value
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!tokens || tokens.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Assets</h3>
            <p className="text-muted-foreground mb-4">
              You have no assets linked to this account
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Buy some assets to start building your portfolio on Tantei.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token, index) => {
              const percentage = generateAllocationPercentage(token.balance);
              const colorIndex = index % ASSET_COLORS.length;

              return (
                <div
                  key={index}
                  className="group transition-all duration-200 hover:bg-muted/50 p-2 rounded-lg -mx-2"
                >
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${ASSET_COLORS[colorIndex]}`}
                      ></div>
                      <span className="text-sm font-medium">
                        {token.name} ({token.symbol})
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {view === "percentage"
                        ? `${percentage.toFixed(1)}%`
                        : `${formatBalance(token.balance)} ${token.symbol}`}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${ASSET_COLORS[colorIndex]} rounded-full transition-all duration-300`}
                      style={{
                        width: `${Math.max(1, percentage)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Value</span>
                <span className="font-bold">
                  {formatBalance(calculateTotalValue())}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
