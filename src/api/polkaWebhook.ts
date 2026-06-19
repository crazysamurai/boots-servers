import { Request, Response } from "express";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";
import { upgradeToChirpyRed, getUser } from "../db/queries/users.js";
import { getAPIKey } from "./auth.js";
import { config } from "../config.js";

type Payload = {
  event: string;
  data: {
    userId: string;
  };
};

export async function handlerPolkaEvent(req: Request, res: Response) {
  const APIKey = getAPIKey(req);
  if (APIKey !== config.apiConfig.polkaKey) {
    res.status(401).send();
    return;
  }
  const payload: Payload = req.body;

  if (!payload || !payload.event || !payload.data || !payload.data.userId)
    throw new BadRequestError("malformed event request");

  if (payload.event !== "user.upgraded") {
    res.status(204).send();
    return;
  }
  const userId = payload.data.userId;
  await getUser(userId);
  await upgradeToChirpyRed(userId);
  res.status(204).send();
}
