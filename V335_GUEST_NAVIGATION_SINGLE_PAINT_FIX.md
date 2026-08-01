# V335 Guest Navigation Single Paint Fix

## Fixed

- Guest navigation now waits for both authentication and Season 6 access before its first paint.
- Season 6 is no longer inserted into an already visible menu after refresh.
- Desktop and mobile menu order no longer shifts during startup.
- Active signed-in members do not wait for the public Season 6 access request.
- The strategy-access request has a 2.5 second timeout and resolves once to the conservative locked fallback on failure.

## Preserved

- Season 6 remains public when no team assignments exist and locked after assignments begin.
- V334 shared PC authentication-control styling is unchanged.
