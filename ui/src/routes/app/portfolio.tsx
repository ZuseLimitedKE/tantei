import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, TrendingUp, Users, Clock, AlertCircle } from "lucide-react";
import { mockAgents, generatePerformanceData } from "@/services/mockData";
import PerformanceChart from "@/components/agents/performance-chart";
import AgentCard from "@/components/agents/agent-card";
export const Route = createFileRoute("/app/portfolio")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("my-agents");
  const followedAgents = mockAgents.slice(0, 3); // Simulate user following some agents
  const performanceData = generatePerformanceData(60);
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-blue-100 p-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-muted-foreground">
                      Total ROI
                    </h3>
                    <p className="text-2xl font-bold text-green-500">+18.7%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-muted-foreground">
                      Portfolio Value
                    </h3>
                    <p className="text-2xl font-bold">$4,285.63</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-muted-foreground">
                      Active Agents
                    </h3>
                    <p className="text-2xl font-bold">
                      {followedAgents.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-amber-100 p-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-muted-foreground">
                      Last Trade
                    </h3>
                    <p className="text-2xl font-bold">12 min ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="my-agents" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger
                  value="my-agents"
                  className={
                    activeTab === "my-agents" ? "text-primary" : "text-black"
                  }
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
                  className={
                    activeTab === "activity" ? "text-primary" : "text-black"
                  }
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-agents">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {followedAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}

                  <Card className="flex flex-col items-center justify-center border-dashed p-6 h-full min-h-[300px]">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <PlusIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Add More Agents
                    </h3>
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      Discover more AI agents to follow and diversify your
                      portfolio
                    </p>
                    <Button asChild>
                      <a href="/">Browse Marketplace</a>
                    </Button>
                  </Card>
                </div>
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
                      <CardTitle className="text-lg">
                        Asset Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">HBAR</span>
                            <span className="text-sm text-muted-foreground">
                              65%
                            </span>
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
                            <span className="text-sm text-muted-foreground">
                              20%
                            </span>
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
                            <span className="text-sm text-muted-foreground">
                              10%
                            </span>
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
                            <span className="text-sm text-muted-foreground">
                              5%
                            </span>
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

                  <div className="lg:col-span-3">
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
                                  <p className="font-medium">
                                    HBAR/USDC purchased
                                  </p>
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

              <TabsContent value="activity">
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
                                      ? `${mockAgents[i % mockAgents.length].name} • ${(i + 1) * 3} hours ago`
                                      : `${mockAgents[(i + 2) % mockAgents.length].name} • ${i + 1} days ago`}
                                </p>
                              </div>
                            </div>
                            {i % 3 === 0 && (
                              <div className="text-right">
                                <p
                                  className={`font-medium ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}
                                >
                                  {i % 2 === 0 ? "+" : "-"}${(i + 1) * 7}.
                                  {(i + 2) * 3}
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
          </div>
        </div>
      </div>
    </div>
  );
}

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
