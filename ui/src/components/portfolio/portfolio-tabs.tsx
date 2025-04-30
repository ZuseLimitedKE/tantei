import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePerformanceData } from "@/services/mockData";
import PerformanceChart from "@/components/agents/performance-chart";
import { FollowedAgentsList } from "./followed-agents-list";
import { AssetAllocation } from "./asset-allocation";
import { RecentTrades } from "./recent-trades";
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
            <RecentTrades />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
