import { NewUser, users } from "../schema.js";
import { db } from "../index.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}
//Array destructuring is used to get the first item from the returned array. This is because drizzle returns an array of results, even if there is only one result.
