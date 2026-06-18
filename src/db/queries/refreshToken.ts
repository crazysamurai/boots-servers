import { NewRefreshToken, refreshTokens } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(payload: NewRefreshToken) {
  const result = await db.insert(refreshTokens).values(payload).returning();
  if (result.length === 0)
    throw new Error("Failed to create refresh token in db");
  return result[0];
}

export async function getUserFromRefreshToken(token: string) {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  if (result.length === 0) return;
  return result[0];
}

export async function setTokenRevoked(token: string) {
  const result = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(Date.now()) })
    .where(eq(refreshTokens.token, token))
    .returning();

  if (result.length === 0) throw new Error("Failed to revoke token in db");
  return result[0];
}
