import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/hero";
import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Hackathon } from "@/components/hackathon";
export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen  overflow-x-hidden">
      {/*Hero section*/}
      <Hero />
      {/*Features Section*/}
      <Features />
      {/* Hackathon Section */}
      <Hackathon />
      <Footer />
    </div>
  );
}
