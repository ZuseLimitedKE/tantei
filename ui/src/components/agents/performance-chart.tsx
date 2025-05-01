import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PortfolioGraph } from "@/services/types";

interface PerformanceChartProps {
  data: PortfolioGraph[];
  title?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">
          Value: ${payload[0].value?.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-KE", { month: "short", day: "numeric" });
};

const calculateDomain = (data: PortfolioGraph[]) => {
  if (!data.length) return [0, 0] as [number, number];

  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Add some padding
  const padding = (max - min) * 0.1;
  return [min - padding, max + padding] as [number, number];
};

const PerformanceChart = ({
  data,
  title = "Performance",
}: PerformanceChartProps) => {
  const [timeframe, setTimeframe] = useState("7d");

  const filterDataByTimeframe = (days: number) => {
    if (days >= data.length) return data;
    return data.slice(-days - 1);
  };

  const getFilteredData = () => {
    switch (timeframe) {
      case "7d":
        return filterDataByTimeframe(7);
      case "30d":
        return filterDataByTimeframe(30);
      case "90d":
        return filterDataByTimeframe(90);
      case "1y":
        return filterDataByTimeframe(365);
      default:
        return data;
    }
  };

  const filteredData = getFilteredData();
  const domain = calculateDomain(filteredData);

  // Calculate performance metrics
  const firstValue = filteredData[0]?.value || 0;
  const lastValue = filteredData[filteredData.length - 1]?.value || 0;
  const changePercent = firstValue
    ? ((lastValue - firstValue) / firstValue) * 100
    : 0;
  const isPositive = changePercent >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Tabs
            defaultValue="30d"
            className="w-auto"
            onValueChange={setTimeframe}
          >
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="mt-1">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">${lastValue.toFixed(2)}</span>
            <span
              className={`ml-2 text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            ${firstValue.toFixed(2)} → ${lastValue.toFixed(2)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71D0FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#71D0FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                interval="preserveStartEnd"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={domain}
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={60}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#71D0FF"
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
