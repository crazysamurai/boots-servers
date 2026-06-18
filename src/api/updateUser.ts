import { Request, Response } from "express";
import { getBearerToken, hashPassword, validateJWT } from "./auth.js";
import { config } from "../config.js";
import { getUserByEmail, updateUser } from "../db/queries/users.js";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";

type Payload = {
  email: string;
  password: string;
};

export async function handlerUpdateUserDetails(req: Request, res: Response) {
  const token = getBearerToken(req);
  const secret = config.tokenConfig.jwtSecret;
  const userId = validateJWT(token, secret);
  const payload: Payload = req.body;

  if (!payload.password || !payload.email) {
    throw new BadRequestError("Missing required fields");
  }

  hashPassword(payload.password);
  await updateUser(userId, payload.email, payload.password);
  const user = await getUserByEmail(payload.email);

  if (!user) throw new Error("Failed to get user data");

  const updateResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  };

  res.status(200).json(updateResponse);
}
