import { Request, Response } from "express";
import { cleanup } from "./profane.js";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";
import { createChirp } from "../db/queries/chirp.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

type Payload = {
  body: string;
};

export type Chirp = {
  id: String;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  userId: string;
};

export async function handlerCreateChirp(req: Request, res: Response) {
  const MAX_CHIRP_LENGTH = 140;

  let payload: Payload = req.body;
  const chirp = payload.body;
  let userId;

  const token = getBearerToken(req);
  userId = validateJWT(token, config.tokenConfig.jwtSecret);

  if (chirp.length > MAX_CHIRP_LENGTH) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`,
    );
  } else {
    const cleanedMessage = cleanup(chirp);
    const cleaned = {
      body: cleanedMessage,
      userId: userId,
    };

    const result = await createChirp(cleaned);
    if (!result) throw new Error("Failed to create chirp");

    const data: Chirp = {
      id: result.id,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      body: result.body,
      userId: result.userId,
    };
    res.status(201).json(data);
  }
}
