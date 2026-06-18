import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middleware/middlewareErrorHandler.js";
import { config } from "../config.js";

type Params = {
  email: string;
  password: string;
};

export async function handlerLoginUser(req: Request, res: Response) {
  const params: Params = req.body;

  let duration = config.tokenConfig.accessTokenExpiration;

  if (!params.password || !params.email)
    throw new BadRequestError("missing field values to login");

  const user = await getUserByEmail(params.email);

  if (!user) throw new UnauthorizedError("incorrect email or password");

  const doesPasswordMatch = await checkPasswordHash(
    params.password,
    user.hashedPassword,
  );
  const token = makeJWT(user.id, duration, config.tokenConfig.jwtSecret);

  const refreshToken = await makeRefreshToken(user.id);

  const loginResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token,
    refreshToken: refreshToken,
  };

  if (doesPasswordMatch && token) {
    res.status(200).json(loginResponse);
  } else {
    throw new UnauthorizedError("login failed");
  }
}
