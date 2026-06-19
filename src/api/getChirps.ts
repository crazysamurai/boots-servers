import { Request, Response } from "express";
import { getAllChirps, getChirpByAuthorId } from "../db/queries/chirp.js";
import type { Chirp } from "./createChirp.js";

export async function handlerGetChirps(req: Request, res: Response) {
  let authorId = "";
  let sort = "";

  let authorIdQuery = req.query.authorId;
  let sortQuery = req.query.sort;

  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }

  if (typeof sortQuery === "string") {
    sort = sortQuery;
  }

  let chirpsArray: Chirp[] = await getAllChirps();

  if (!authorId) chirpsArray = await getAllChirps();
  else chirpsArray = await getChirpByAuthorId(authorId);

  if (sort === "desc")
    chirpsArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  res.status(200).json(chirpsArray);
}
