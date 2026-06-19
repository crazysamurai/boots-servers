import { NewChirp, chirps } from "../schema.js";
import { db } from "../index.js";
import { asc, eq } from "drizzle-orm";
import {
  ForbiddenError,
  NotFoundError,
} from "../../middleware/middlewareErrorHandler.js";

export async function createChirp(payload: NewChirp) {
  const [result] = await db.insert(chirps).values(payload).returning();
  return result;
}

export async function getAllChirps() {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return result;
}

export async function getChirpByChirpId(chirpId: string) {
  const result = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  if (result.length === 0) throw new NotFoundError("Chirp not found");
  return result[0];
}

export async function getChirpByAuthorId(authorId: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId));
  if (result.length === 0) throw new NotFoundError("No chirps exist");
  return result;
}

export async function deleteChirpById(chirpId: string, userId: string) {
  const result = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId) && eq(chirps.userId, userId))
    .returning();
  if (result.length === 0) throw new ForbiddenError("failed to delete chirp");
  return result;
}
