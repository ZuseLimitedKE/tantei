import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/hero";
import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Hackathon } from "@/components/hackathon";
import { NavbarLogo } from "@/components/ui/resizable-navbar";
export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen   overflow-x-hidden">
      <div className="   inset-x-0 top-0 z-40 w-full">
        <NavbarLogo />
      </div>
      {/*Hero section*/}
      <Hero />
      {/*Features Section*/}
      <Features />
      {/* Hackathon Section */}
      <Hackathon />
      {/*Footer section*/}
      <Footer />
    </div>
  );
}
