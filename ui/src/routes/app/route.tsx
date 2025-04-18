import { Outlet, createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
export const Route = createFileRoute("/app")({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
