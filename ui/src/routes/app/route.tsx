// THIS IS THE LAYOUT FILE FOR THE /app don't remove it
import { Outlet, createFileRoute } from "@tanstack/react-router";
import AppNavbar from "@/components/Navbar";
export const Route = createFileRoute("/app")({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <div className="relative w-full min-h-screen">
      <AppNavbar />
      <div className="mt-20 px-8">
        <Outlet />
      </div>
    </div>
  );
}
