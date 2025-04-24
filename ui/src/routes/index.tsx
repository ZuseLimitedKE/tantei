import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { ArrowDown, Heart, Calendar, Code, Award, Users } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            AI-Powered Trading on Hedera
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Discover and follow cutting-edge AI trading agents built for the
            Hedera ecosystem
          </p>
          <Link to="/app/marketplace">
            <Button
              size="lg"
              className="text-xl font-semibold h-14 p-1 w-56 rounded-full px-8"
            >
              Explore Agents
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 animate-bounce p-1 bg-gray-100 shadow rounded-full"
        >
          <ArrowDown className="h-8 w-8  text-muted-foreground" />
        </motion.div>
      </motion.section>
      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why HederaFlow?
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Our platform combines the power of AI with the security and speed of
            Hedera's distributed ledger
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="h-10 w-10 text-primary" />,
                title: "AI-Powered Trading",
                description:
                  "Leverage advanced AI models to automate your trading strategies on the Hedera network",
              },
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Real-Time Analytics",
                description:
                  "Monitor performance metrics and market trends with comprehensive real-time analytics",
              },
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Secure & Decentralized",
                description:
                  "Built on Hedera's secure and fast distributed ledger technology",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow card-hover"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Hackathon Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-r from-primary/10 to-hedera-accent/10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <div className="inline-block bg-primary/10 rounded-lg px-4 py-2 text-primary font-medium mb-4">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Hedera AI Agents Hackathon 2025
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built during the Hedera Hackathon
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Tantei was conceptualized and developed during the Hedera
                Hackathon, aiming to revolutionize trading on the Hedera network
                by leveraging artificial intelligence and machine learning.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-background rounded-full px-4 py-2 text-sm font-medium">
                  #AI
                </div>
                <div className="bg-background rounded-full px-4 py-2 text-sm font-medium">
                  #Hedera
                </div>
                <div className="bg-background rounded-full px-4 py-2 text-sm font-medium">
                  #DeFi
                </div>
                <div className="bg-background rounded-full px-4 py-2 text-sm font-medium">
                  #Trading
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <IconBrandGithub className="w-4 h-4" />
                  View on GitHub
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-card border rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Hackathon Milestones
                </h3>
                <ul className="space-y-4">
                  {[
                    "Initial concept development and validation",
                    "Core AI algorithm implementation",
                    "Hedera network integration for secure transactions",
                    "User interface design and development",
                    "Testing and deployment of the MVP",
                  ].map((milestone, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-3 h-3 text-primary" />
                      </div>
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <Footer />
    </div>
  );
}
