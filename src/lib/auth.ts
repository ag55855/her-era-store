import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "her_era_admin_session";

function getSecret() {
  return process.env.ADMIN_PASSWORD || "HerEra2026!";
}

export function createSessionToken(): string {
  const secret = getSecret();
  const timestamp = Date.now().toString();
  const sig = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");
  return `${timestamp}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, sig] = parts;
  const expected = crypto.createHmac("sha256", getSecret()).update(timestamp).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
