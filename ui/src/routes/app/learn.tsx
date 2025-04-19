import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/learn')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/learn"!</div>
}
