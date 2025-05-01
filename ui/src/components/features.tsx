import { motion } from "framer-motion";
import { Code, Users, Award } from "lucide-react";
export function Features() {
  const features = [
    {
      icon: <Code className="h-10 w-10" />,
      title: "AI-Powered Trading",
      description:
        "Leverage advanced AI models to automate your trading strategies on the Hedera network",
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: "Real-Time Analytics",
      description:
        "Monitor performance metrics and market trends with comprehensive real-time analytics",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Secure & Decentralized",
      description:
        "Built on Hedera's secure and fast distributed ledger technology",
    },
  ];

  return (
    <motion.section
      id="features"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 px-4 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Why Tantei?
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Our platform combines the power of AI with the security and speed of
          Hedera's distributed ledger
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative flex flex-col h-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              <div className="relative flex-grow p-8 flex flex-col items-center">
                <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-600/20 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <div className="text-primary">{feature.icon}</div>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-center group-hover:text-purple-700 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </div>

              <div className="relative w-full mt-auto">
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{
                    borderBottomLeftRadius: "0.75rem",
                    borderBottomRightRadius: "0.75rem",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
