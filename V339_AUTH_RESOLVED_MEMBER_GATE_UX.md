# EZPK v339

- Delays every automatic login request until the existing session check finishes.
- Active signed-in members bypass both the login modal and member gate.
- Keeps both protected content and the member gate hidden while authentication is unresolved.
- Opens the login modal only for guests, including legacy `?login=1` entry links.
- Keeps the member gate for inactive, suspended, or departed accounts.
- Migrates Vote and Request Board access handling to the shared authentication state.
- Applies one shared member-gate card and Login / Sign Up button UX/UI across protected pages.
- Updates shared asset cache versions to prevent stale authentication behavior.
