import { Request, Response } from "express";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";
import { deleteChirpById, getChirpByChirpId } from "../db/queries/chirp.js";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";

export async function handlerDeleteChirp(req: Request, res: Response) {
  const token = getBearerToken(req);
  const secret = config.tokenConfig.jwtSecret;
  const userId = validateJWT(token, secret);

  const chirpId = req.params.chirpId;

  if (typeof chirpId !== "string") throw new BadRequestError("Invalid chirpId");

  await getChirpByChirpId(chirpId);
  await deleteChirpById(chirpId, userId);

  res.status(204).send();
}
