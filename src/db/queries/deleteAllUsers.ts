import { db } from "../index.js";
import { users } from "../schema.js";
import { config } from "../../config.js";
import { ForbiddenError } from "../../middleware/middlewareErrorHandler.js";

export async function deleteAllUsers() {
  if (config.apiConfig.platform !== "dev")
    throw new ForbiddenError("not dev platform");
  else await db.delete(users);
}
