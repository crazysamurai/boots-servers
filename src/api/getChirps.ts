import { Request, Response } from "express";
import { getAllChirps } from "../db/queries/chirp.js";
import type { Chirp } from "./createChirp.js";

export async function handlerGetChirps(req: Request, res: Response) {
  const chirpsArray: Chirp[] = await getAllChirps();
  res.status(200).json(chirpsArray);
}
