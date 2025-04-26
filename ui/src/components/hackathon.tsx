import { motion } from "framer-motion";
import { Heart, Calendar } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "./ui/button";
export function Hackathon() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 px-4 bg-gradient-to-r from-primary/10 to-gray-50/10"
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
  );
}
