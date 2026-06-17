import { Request, response, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";
import { hashPassword } from "./auth.js";
import { NewUser } from "../db/schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
  };

  const params: Parameters = req.body;
  if (!params.email || !params.password)
    throw new BadRequestError("Missing required fields");
  const hashed = await hashPassword(params.password);
  const user = await createUser({
    email: params.email,
    hashedPassword: hashed,
  } satisfies NewUser);

  if (!user) throw new Error("Failed to create user");

  const data = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  };

  res.status(201).json(data);
}
