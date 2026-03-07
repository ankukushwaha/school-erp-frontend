import { useLocation } from 'react-router-dom'

export function TemporaryModulePage() {
  const location = useLocation()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Module Coming Soon</h1>
      <p className="text-sm text-muted-foreground">
        Temporary route for <span className="font-medium">{location.pathname}</span>. This screen is shown until the page is implemented.
      </p>
    </div>
  )
}
