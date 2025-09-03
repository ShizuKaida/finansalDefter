export default async function fetchWithRefresh(url: string, options: RequestInit = {}) {

  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/refresh", { method: "GET" });

    if (refreshRes.ok) {
      // Yeni token geldi ama HttpOnly olduğu için document.cookie'den okunamaz
      // Bu yüzden en garantici yol: sayfayı yenile
      window.location.reload();
    } else {
      alert("Oturum süresi doldu. Lütfen tekrar giriş yap.");
    }
  }

  return res;
}
