/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  // type HederaSignerType,
  // type HWBridgeSigner,
  // useAccountId,
  useWallet,
} from "@buidlerlabs/hashgraph-react-wallets";
import { toast, Toaster } from "sonner";
interface Props {
  agentName: string;
  strategy: number;
  agentAddress: string;
}

export function Copy(props: Props) {
  console.log("Copy component", props);
  const [isLoading, setIsLoading] = useState(false);
  const { agentName /*, strategy, agentAddress*/ } = props;
  console.log("Copy component props", props);

  const { isConnected } = useWallet();

  const handleCopy = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    return;
  };

  return (
    <div className="w-full mt-2">
      <Toaster />
      <button
        onClick={handleCopy}
        disabled={isLoading || !isConnected}
        className="w-[88%] mx-auto px-4 py-2 rounded-md bg-[var(--primary)] hover:bg-purple-500 text-[var(--primary-foreground)] font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>Copy {agentName}</span>
        )}
      </button>
    </div>
  );
}
