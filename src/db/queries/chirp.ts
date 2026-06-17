import { NewChirp, chirps } from "../schema.js";
import { db } from "../index.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(payload: NewChirp) {
  const [result] = await db.insert(chirps).values(payload).returning();
  return result;
}

export async function getAllChirps() {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return result;
}

export async function getChirpById(chirpId: string) {
  const result = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  if (result.length === 0) return;
  return result[0];
}
