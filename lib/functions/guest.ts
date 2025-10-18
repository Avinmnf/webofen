// utils/guest.ts
export function getGuestId(): string {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID(); // modern way to generate unique IDs
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}
