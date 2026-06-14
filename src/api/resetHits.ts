import { Response, Request } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/deleteAllUsers.js";

export async function resetHits(req: Request, res: Response) {
  config.apiConfig.fileServerHits = 0;
  await deleteAllUsers();
  res.sendStatus(200);
}
