import { HWBridgeProvider } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { HederaTestnet } from "@buidlerlabs/hashgraph-react-wallets/chains";
import LoadingFallback from "@/components/ui/wallet-loading-fallback";

// 1. Get projectId from https://cloud.reown.com
const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";
// 2. Create a metadata object - optional
const metadata = {
  name: "Tantei",
  description:
    "A place for developers to publish their agents and allow people to follow their trades for a commision",
  url: window.location.origin, // origin must match your domain & subdomain
  icons: ["../../assets/logo/png/logo-no-background.png"],
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <HWBridgeProvider
      metadata={metadata}
      projectId={projectId}
      connectors={[HWCConnector]}
      chains={[HederaTestnet]}
      LoadingFallback={LoadingFallback}
    >
      {children}
    </HWBridgeProvider>
  );
};
