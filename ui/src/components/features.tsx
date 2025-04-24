import { motion } from "framer-motion";

import { Code, Users, Award } from "lucide-react";

export function Features() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Why Tantei?
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
  );
}
