import { Request, response, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
  };

  const params: Parameters = req.body;
  if (!params.email) throw new BadRequestError("Missing required fields");

  const user = await createUser({ email: params.email });

  if (!user) throw new Error("Failed to create user");
  res.status(201).json(user);
}
