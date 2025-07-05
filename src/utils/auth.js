export function isAuthenticated(token) {
  // A simple check to see if the token exists.
  // In a real-world application, you'd also want to verify the token's expiration.
  return !!token;
}