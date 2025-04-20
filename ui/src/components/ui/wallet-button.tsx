// import { networks } from "@/config";
import { toast } from "sonner";
import { IconWallet } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { NavbarButton } from "./resizable-navbar";
export const WalletButton = () => {
  const { isConnected, connect, disconnect } = useWallet(HWCConnector);
  const prevConnectedRef = useRef(false);

  // Effect to detect when connection state changes from false to true
  useEffect(() => {
    if (isConnected && !prevConnectedRef.current) {
      toast.success("Successfully connected to wallet");
    }
    prevConnectedRef.current = isConnected;
  }, [isConnected]);

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (error) {
      toast.error("Failed to disconnect wallet");
      console.error(error);
    }
  };

  return (
    <>
      {!isConnected ? (
        <NavbarButton
          className="flex bg-primary text-white items-center justify-center"
          onClick={handleConnect}
        >
          <IconWallet className="mr-2 h-4 w-4" /> Connect Wallet
        </NavbarButton>
      ) : (
        <NavbarButton
          className="flex bg-primary text-white items-center justify-center"
          onClick={handleDisconnect}
        >
          <IconWallet className="mr-2 h-4 w-4" /> Disconnect Wallet
        </NavbarButton>
      )}
    </>
  );
};
