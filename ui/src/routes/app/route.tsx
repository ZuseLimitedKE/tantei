// THIS IS THE LAYOUT FILE FOR THE /app don't remove it
import { ChatDrawer } from "@/components/ui/chat-drawer";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { IconMessage } from "@tabler/icons-react";
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
            <div className="animate-pulse h-full w-full bg-gray-200 rounded-md dark:bg-neutral-800" />
          </div>
        }
      >
        <AppNavbar />
        <ChatDrawer>
          <div className="rounded-full flex items-center justify-center p-1 w-14 h-14 bg-primary  text-white cursor-pointer  z-10 fixed right-12 bottom-12">
            <IconMessage className="w-2/3 h-2/3" strokeWidth={1.75} />
          </div>
        </ChatDrawer>
      </Suspense>

      <div className="mt-20 md:px-8 px-6">
        <Outlet />
      </div>
    </div>
  );
}
