// utils/guest.ts
export function getGuestId(): string {
  if (typeof window === 'undefined') {
    return 'temp-guest-id'; // For server-side rendering
  }
  
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}