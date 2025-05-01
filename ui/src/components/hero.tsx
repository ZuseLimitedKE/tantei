import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoveRight, ArrowDown, Printer } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";

const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const navigate = useNavigate();
  const titles = useMemo(() => ["Smart", "Fast", "Secure", "Adaptive"], []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="min-h-screen mt-6  flex flex-col items-center  text-center px-4  bg-white ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <div className="flex gap-8 py-12  items-center justify-center flex-col">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="secondary"
              size="sm"
              className="gap-4 text-sm cursor-pointer hover:underline"
              onClick={() =>
                navigate({
                  href: " https://dorahacks.io/hackathon/hedera-ai-agents/buidl",
                  reloadDocument: true,
                })
              }
            >
              Hedera AI Agents Hackathon 2025 <MoveRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <div className="flex gap-4 flex-col">
            <h1 className="text-6xl md:text-8xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="text-black block mb-2 font-black">
                Trading on Tantei is
              </span>
              <span className="relative  flex w-full justify-center overflow-hidden text-center  md:pt-1 md:h-28 h-20">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute text-primary font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                          y: 0,
                          opacity: 1,
                        }
                        : {
                          y: titleNumber > index ? -150 : 150,
                          opacity: 0,
                        }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground/70 max-w-2xl mx-auto">
              Experience the future of algorithmic trading with AI-powered
              agents built specifically for the Hedera ecosystem.{" "}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Link to="/app/marketplace">
              <Button size="lg" className="gap-4 text-lg h-12 font-semibold">
                Explore Agents <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/app/publish">
              <Button
                size="lg"
                variant="outline"
                className="gap-4 font-semibold text-lg h-12"
              >
                Publish an Agent <Printer className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 bg-secondary p-1 animate-bounce rounded-full shadow"
      >
        <ArrowDown className="h-8 w-8  text-muted-foreground" />
      </motion.div>
    </section>
  );
};

export default Hero;
