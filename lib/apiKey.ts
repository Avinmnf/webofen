import crypto from 'crypto';

export function generateApiKey(secret: string): string {
  // Just hash the secret alone, no date
  return crypto.createHmac('sha256', secret).update(secret).digest('hex');
}