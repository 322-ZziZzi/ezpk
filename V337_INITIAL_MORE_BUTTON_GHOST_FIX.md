# V337 Initial More Button Ghost Fix

- The desktop More navigation container is now hidden in its initial generated markup.
- The empty styled More button can no longer paint as a rectangular ghost during refresh.
- Existing navigation logic still reveals the container only after authentication and access state resolve.
- V335 single-paint navigation, Season 6 access behavior, and V336 authentication UX/UI remain unchanged.
