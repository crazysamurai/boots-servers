import { Request, Response } from "express";
import { getChirpByChirpId } from "../db/queries/chirp.js";
import type { Chirp } from "./createChirp.js";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";

export async function handlerGetChirpById(req: Request, res: Response) {
  const chirpId = req.params.chirpId;
  if (typeof chirpId !== "string") throw new BadRequestError("Invalid chirpId");

  const chirp: Chirp | undefined = await getChirpByChirpId(chirpId);

  res.status(200).json(chirp);
}
