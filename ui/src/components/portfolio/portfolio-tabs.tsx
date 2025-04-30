import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { generatePerformanceData } from "@/services/mockData";
import PerformanceChart from "@/components/agents/performance-chart";
import { FollowedAgentsList } from "./followed-agents-list";
import { AssetAllocation } from "./asset-allocation";
export function PortfolioTabs() {
  const [activeTab, setActiveTab] = useState("my-agents");
  const performanceData = generatePerformanceData(60);

  return (
    <Tabs defaultValue="my-agents" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger
          value="my-agents"
          className={activeTab === "my-agents" ? "text-primary" : "text-black"}
        >
          My Agents
        </TabsTrigger>
        <TabsTrigger
          className={
            activeTab === "my-portfolio" ? "text-primary" : "text-black"
          }
          value="my-portfolio"
        >
          My Portfolio
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className={` hidden
                    ${activeTab === "activity" ? "text-primary" : "text-black"}
                  `}
        >
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-agents">
        <FollowedAgentsList />
      </TabsContent>

      <TabsContent value="my-portfolio">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <PerformanceChart
              data={performanceData}
              title="Portfolio Performance"
            />
          </div>
          <AssetAllocation />
          <div className="lg:col-span-3 ">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Recent Trading Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between pb-4 border-b"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-blue-100 p-1.5 mt-0.5">
                          <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">HBAR/USDC purchased</p>
                          <p className="text-sm text-muted-foreground">
                            via HBAR Momentum X • {30 * i} mins ago
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">+{i * 105} HBAR</p>
                        <p className="text-sm text-muted-foreground">
                          $24.{i}0
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
