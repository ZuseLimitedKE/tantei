// THIS IS THE LAYOUT FILE FOR THE /app don't remove it
import { Outlet, createFileRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";

// Lazy load the AppNavbar
const AppNavbar = React.lazy(() => import("@/components/Navbar"));
export const Route = createFileRoute("/app")({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <div className="relative w-full min-h-screen">
      <Suspense
        fallback={
          <div className="h-[80px] w-full flex items-center justify-center">
            {/* Placeholder/Skeleton */}
            <div className="animate-pulse h-[40px] w-full bg-gray-200 rounded-full dark:bg-neutral-800" />
          </div>
        }
      >
        <AppNavbar />
      </Suspense>

      <div className="mt-20 px-8">
        <Outlet />
      </div>
    </div>
  );
}
