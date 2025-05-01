import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  message?: string;
  subMessage?: string;
  icon?: React.ReactNode;
  className?: string;
  actionButton?: React.ReactNode;
}

/**
 * Generic empty state component for displaying when no data is available
 */
export function EmptyState({
  title = "No Data Available",
  message = "There is no data to display at this time.",
  subMessage,
  icon,
  className = "",
  actionButton,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center py-8">
          {icon && (
            <div className="rounded-full bg-primary/10 p-4 mb-4">{icon}</div>
          )}
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{message}</p>
          {subMessage && (
            <p className="text-sm text-muted-foreground mb-2">{subMessage}</p>
          )}
          {actionButton}
        </div>
      </CardContent>
    </Card>
  );
}
