export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null; // SSR koruması
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}
