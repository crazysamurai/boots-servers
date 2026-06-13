import { Response, Request } from "express";
import { config } from "../config.js";

export async function resetHits(req: Request, res: Response) {
  config.fileServerHits = 0;
  res.sendStatus(200)
}
