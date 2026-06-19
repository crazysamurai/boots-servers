import { NewUser, users } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../middleware/middlewareErrorHandler.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUser(userId: string) {
  const result = await db.select().from(users).where(eq(users.id, userId));
  if (result.length === 0) throw new NotFoundError("user not found");
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  if (result.length === 0) return;
  return result[0];
}

export async function updateUser(
  userId: string,
  email: string,
  password: string,
) {
  const result = await db
    .update(users)
    .set({ hashedPassword: password, email: email })
    .where(eq(users.id, userId))
    .returning();
  if (result.length === 0) throw new Error("user update failed");
}

export async function upgradeToChirpyRed(userId: string) {
  const result = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning();
  if (result.length === 0) throw new Error("Failed to set chirpy red");
  return result[0];
}
