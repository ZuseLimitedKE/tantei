import { createFileRoute } from "@tanstack/react-router";
import { PortfolioStats } from "@/components/portfolio/stats";
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export const Route = createFileRoute("/app/portfolio")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isConnected } = useWallet();
  const { data: accountId } = useAccountId();

  if (!isConnected || !accountId) {
    return (
      <Card className="md:mx-12 shadow-none border-none">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Wallet not connected</h3>
            <p className="text-muted-foreground mb-4">
              We encountered an issue while trying to fetch your portfolio.
            </p>
            <p className="text-sm text-muted-foreground">
              Please connect your wallet to proceed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              My Portfolio
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your agents' performance and manage your copy-trading
              settings
            </p>
          </div>
          <PortfolioStats />
          <div className="mb-8">
            <PortfolioTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
