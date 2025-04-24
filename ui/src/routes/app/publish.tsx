import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Info, FileCode, AlertCircle, Tag, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { publishAgentSchema } from "@/types/zod";
import { useMutation } from "@tanstack/react-query";
import { PublishAgent } from "@/services/agents";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { Spinner } from "@/components/ui/spinner";
export const Route = createFileRoute("/app/publish")({
  component: RouteComponent,
});
function RouteComponent() {
  const { isConnected } = useWallet();

  const { data: accountId } = useAccountId();
  const form = useForm<z.infer<typeof publishAgentSchema>>({
    resolver: zodResolver(publishAgentSchema),
    defaultValues: {
      agent_name: "",
      strategy_description: "",
      strategy_type: "",
      risk_level: "",
      subscription_fee: 0,
      owner_wallet_address: "",
      address: "",
    },
  });
  const { mutate, isPending: isPublishing } = useMutation({
    mutationFn: PublishAgent,
    onSuccess(_, variables) {
      toast.success(`successfully published ${variables.agent_name}`);
      form.reset();
    },
    //TODO : INVALIDATE DATA ON SUCCESS
  });

  function onSubmit(values: z.infer<typeof publishAgentSchema>) {
    if (!accountId || !isConnected) {
      toast.warning(
        "you need to connect your wallet before publishing an agent",
      );
      return;
    }
    try {
      mutate({ ...values, owner_wallet_address: accountId });
    } catch (error) {
      console.error(error);
      toast.error("unable to publish your agent , please contact support");
    }
  }
  return (
    <div className="min-h-screen">
      <div className="container md:px-4  pb-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Publish Your Agent
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your trading strategy with the community and earn rewards
            </p>
          </div>

          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Info className="mr-2 h-5 w-5 text-muted-foreground" />
                        Basic Information
                      </h2>

                      <FormField
                        control={form.control}
                        name="agent_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agent Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., HBAR Momentum Strategy"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Choose a clear, descriptive name for your agent
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="strategy_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strategy Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe how your agent works, what signals it uses, and its trading approach..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Be transparent about how your strategy works
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
                        Categorization
                      </h2>

                      <FormField
                        control={form.control}
                        name="strategy_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strategy Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a strategy type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="momentum">
                                  Momentum Trading
                                </SelectItem>
                                <SelectItem value="arbitrage">
                                  Arbitrage
                                </SelectItem>
                                <SelectItem value="swing">
                                  Swing Trading
                                </SelectItem>
                                <SelectItem value="scalping">
                                  Scalping
                                </SelectItem>
                                <SelectItem value="defi">DeFi Yield</SelectItem>
                                <SelectItem value="trend">
                                  Trend Following
                                </SelectItem>
                                <SelectItem value="hedging">Hedging</SelectItem>
                                <SelectItem value="dca">
                                  Dollar Cost Averaging
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Categorize your trading approach
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <FileCode className="mr-2 h-5 w-5 text-muted-foreground" />
                        Strategy Implementation
                      </h2>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agent Wallet Address</FormLabel>
                            <FormControl>
                              <Input placeholder="0.0.12345....." {...field} />
                            </FormControl>
                            <FormDescription>
                              Provide the wallet address of the agent
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Settings className="mr-2 h-5 w-5 text-muted-foreground" />
                        Monetization
                      </h2>

                      <FormField
                        control={form.control}
                        name="subscription_fee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Monthly Subscription Fee (HBAR)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input {...field} type="number" />
                                <div className="absolute inset-y-0 right-6 flex items-center pr-3 pointer-events-none text-muted-foreground">
                                  HBAR
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              How much users will pay to follow your agent
                              (recommended: 20-100 HBAR)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Important Notice
                        </p>
                        <p className="text-sm text-amber-700">
                          All agents are subject to review before being listed
                          on the marketplace. We check for code quality,
                          security, and compliance with our terms.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-start gap-3">
                      <Button
                        variant="outline"
                        className="hidden"
                        type="button"
                      >
                        Save Draft
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPublishing}
                        size="lg"
                        className="text-lg flex items-center justify-center"
                      >
                        {isPublishing && (
                          <Spinner className="mr-2 text-white" size="small" />
                        )}
                        Submit for Review
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
