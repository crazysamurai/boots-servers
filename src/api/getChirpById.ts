import { Request, Response } from "express";
import { getChirpById } from "../db/queries/chirp.js";
import type { Chirp } from "./createChirp.js";
import {
  BadRequestError,
  NotFoundError,
} from "../middleware/middlewareErrorHandler.js";

export async function handlerGetChirpById(req: Request, res: Response) {
  const chirpId = req.params.chirpId;

  if (typeof chirpId !== "string") throw new BadRequestError("Invalid chirpId");

  // console.log(chirpId);
  const chirp: Chirp | undefined = await getChirpById(chirpId);
  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }
  res.status(200).json(chirp);
}
