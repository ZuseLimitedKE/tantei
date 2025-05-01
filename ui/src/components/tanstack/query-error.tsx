import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
interface QueryErrorProps {
  title?: string;
  message?: string;
  subMessage?: string;
  queryKey: unknown[];
  icon?: React.ReactNode;
  className?: string;
  buttonText?: string;
}

/**
 * Generic error component for React Query errors with a retry button
 */
export function QueryError({
  title = "Error Loading Data",
  message = "We encountered an error while retrieving the data.",
  subMessage = "Please check your connection and try again.",
  queryKey,
  icon = <AlertCircle className="h-8 w-8 text-red-600" />,
  className = "",
  buttonText = "Retry",
}: QueryErrorProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center py-8">
          <div className="rounded-full bg-red-100 p-4 mb-4">{icon}</div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{message}</p>
          <p className="text-sm text-muted-foreground mb-2">{subMessage}</p>
          <Button
            size="lg"
            className="font-semibold "
            onClick={handleRetry}
            variant="destructive"
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
