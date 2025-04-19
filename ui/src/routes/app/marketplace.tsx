import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/marketplace")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="min-h-screen">Hello "/marketplace"!</div>;
}
