import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, AlertCircle } from "lucide-react";
import { mockAgents, generatePerformanceData } from "@/services/mockData";
import PerformanceChart from "@/components/agents/performance-chart";
import { FollowedAgentsList } from "./followed-agents-list";
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">HBAR</span>
                    <span className="text-sm text-muted-foreground">65%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">USDC</span>
                    <span className="text-sm text-muted-foreground">20%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">SAUCE</span>
                    <span className="text-sm text-muted-foreground">10%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Other</span>
                    <span className="text-sm text-muted-foreground">5%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: "5%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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

      <TabsContent value="activity" className="hidden">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between pb-4 border-b last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-full p-1.5 mt-0.5 
                                ${i % 3 === 0 ? "bg-blue-100" : i % 3 === 1 ? "bg-green-100" : "bg-amber-100"}`}
                      >
                        {i % 3 === 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                        ) : i % 3 === 1 ? (
                          <Users className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {i % 3 === 0
                            ? "Trade executed"
                            : i % 3 === 1
                              ? "Started following agent"
                              : "Strategy updated"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i % 3 === 0
                            ? `HBAR/USDC • ${(i + 1) * 12} mins ago`
                            : i % 3 === 1
                              ? `${mockAgents[i % mockAgents.length].agent_name} • ${(i + 1) * 3} hours ago`
                              : `${mockAgents[(i + 2) % mockAgents.length].agent_name} • ${i + 1} days ago`}
                        </p>
                      </div>
                    </div>
                    {i % 3 === 0 && (
                      <div className="text-right">
                        <p
                          className={`font-medium ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {i % 2 === 0 ? "+" : "-"}${(i + 1) * 7}.{(i + 2) * 3}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
