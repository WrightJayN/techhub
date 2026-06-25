// Simple HMAC-based token for magic links
// Token format: base64(email + expires + hmac)

const SECRET = import.meta.env.TOKEN_SECRET || 'dev-secret-change-in-production';

export async function createMagicToken(email: string): Promise<string> {
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  const payload = `${email}|${expires}`;
  const hmac = await sign(payload, SECRET);
  return btoa(`${payload}|${hmac}`);
}

export async function verifyMagicToken(token: string): Promise<string | null> {
  try {
    const decoded = atob(token);
    const parts = decoded.split('|');
    if (parts.length !== 3) return null;
    const [email, expiresStr, hmac] = parts;
    const expires = parseInt(expiresStr);
    if (Date.now() > expires) return null; // expired
    const payload = `${email}|${expiresStr}`;
    const expected = await sign(payload, SECRET);
    if (hmac !== expected) return null; // tampered
    return email;
  } catch {
    return null;
  }
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// Session cookie helpers
export function createSessionCookie(email: string, authorId: string): string {
  const value = btoa(JSON.stringify({ email, authorId, created: Date.now() }));
  return `hub_session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function parseSessionCookie(cookieHeader: string | null): { email: string; authorId: string } | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/hub_session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(atob(match[1]));
  } catch {
    return null;
  }
}
