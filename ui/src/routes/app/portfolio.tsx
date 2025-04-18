import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/portfolio')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/portfolio"!</div>
}
