import crypto from 'crypto';

export function generateApiKey(secret: string): string {
  // Use UTC date in YYYY-MM-DD format
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0'); // month is zero-based
  const dd = String(now.getUTCDate()).padStart(2, '0');

  const dateString = `${yyyy}-${mm}-${dd}`; // e.g., "2025-07-17"

  // Combine date + secret as message to hash
  const message = `${dateString}-${secret}`;

  // Return the HMAC SHA256 hash hex digest
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}
const secret = 'this-is-a-very-random-secret';
console.log('Generated API key:', generateApiKey(secret));