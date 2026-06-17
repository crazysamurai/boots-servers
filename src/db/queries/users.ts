import { NewUser, users } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";

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
  if (result.length === 0) return;
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  if (result.length === 0) return;
  return result[0];
}
//Array destructuring is used to get the first item from the returned array. This is because drizzle returns an array of results, even if there is only one result.
