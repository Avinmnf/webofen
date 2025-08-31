// utils/getCurrentUser.ts
export async function getCurrentUser() {
  const res = await fetch(
    `api/proxy/auth/me`,
    {
      credentials: "include", // this sends the cookie
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}
