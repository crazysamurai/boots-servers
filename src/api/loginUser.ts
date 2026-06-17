import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "./auth.js";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middleware/middlewareErrorHandler.js";
import { config } from "../config.js";

type Params = {
  email: string;
  password: string;
  expiresInSeconds?: number; //seconds
};

const DEFAULT_EXPIRATION_LIMIT = 3600;
const MAX_EXPIRATION_LIMIT = 3600;

export async function handlerLoginUser(req: Request, res: Response) {
  const params: Params = req.body;

  let duration = DEFAULT_EXPIRATION_LIMIT;
  if (
    params.expiresInSeconds &&
    (!params.expiresInSeconds || params.expiresInSeconds > MAX_EXPIRATION_LIMIT)
  ) {
    duration = DEFAULT_EXPIRATION_LIMIT;
  }

  if (!params.password || !params.email)
    throw new BadRequestError("missing field values to login");

  const user = await getUserByEmail(params.email);

  if (!user) throw new UnauthorizedError("incorrect email or password");

  const doesPasswordMatch = await checkPasswordHash(
    params.password,
    user.hashedPassword,
  );
  const token = makeJWT(user.id, duration, config.jwtSecret);

  const data = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token,
  };

  if (doesPasswordMatch && token) {
    res.status(200).json(data);
  } else {
    throw new UnauthorizedError("incorrect email or password");
  }
}
