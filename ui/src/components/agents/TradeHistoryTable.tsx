
import type { TradeData } from "@/services/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface TradeHistoryTableProps {
  trades: TradeData[];
}

const TradeHistoryTable = ({ trades }: TradeHistoryTableProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Token Pair</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">
                    {formatTimestamp(trade.timestamp)}
                  </TableCell>
                  <TableCell>{trade.tokenPair}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={trade.direction === "buy" ? "default" : "destructive"}
                      className="flex w-16 items-center justify-center"
                    >
                      {trade.direction === "buy" ? (
                        <><ArrowDown className="mr-1 h-3 w-3" /> Buy</>
                      ) : (
                        <><ArrowUp className="mr-1 h-3 w-3" /> Sell</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{trade.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${trade.price.toFixed(4)}</TableCell>
                  <TableCell className={`text-right ${
                    trade.profitLoss > 0 
                      ? 'text-green-500' 
                      : trade.profitLoss < 0 
                        ? 'text-red-500' 
                        : ''
                  }`}>
                    {trade.direction === "buy" ? "-" : trade.profitLoss > 0 ? "+" : ""}
                    {trade.profitLoss !== 0 ? `$${Math.abs(trade.profitLoss).toFixed(2)}` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeHistoryTable;
