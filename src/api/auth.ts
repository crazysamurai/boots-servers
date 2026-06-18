import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middleware/middlewareErrorHandler.js";
import { Request, Response } from "express";
import { randomBytes } from "node:crypto";
import {
  getUserFromRefreshToken,
  createRefreshToken,
  setTokenRevoked,
} from "../db/queries/refreshToken.js";
import { config } from "../config.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string) {
  const hashed = await argon2.hash(password);
  return hashed;
}

export async function checkPasswordHash(password: string, hash: string) {
  return await argon2.verify(hash, password);
}

export function makeJWT(
  userId: string,
  expiresIn: number,
  secret: string,
): string {
  const issueTime = Math.floor(Date.now() / 1000);
  const expireTime = issueTime + expiresIn;

  const payload: Payload = {
    iss: TOKEN_ISSUER,
    sub: userId,
    iat: issueTime,
    exp: expireTime,
  };

  return jwt.sign(payload, secret); //jwt token created
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (err) {
    throw new UnauthorizedError("invalid token");
  }
  if (!decoded.sub) {
    throw new Error("Token is missing the subject claim");
  }
  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("invalid token issuer");
  }
  return decoded.sub;
}

export async function makeRefreshToken(userId: string) {
  const token = randomBytes(32).toString("hex");
  const refreshTokenExpiration = new Date(
    Date.now() + config.tokenConfig.refreshTokenExpiration,
  );
  await createRefreshToken({
    token,
    userId,
    expiresAt: refreshTokenExpiration,
  });
  return token;
}

export function getBearerToken(req: Request): string {
  const bearer: string | undefined = req?.headers?.authorization;
  if (!bearer) throw new UnauthorizedError("missing auth token");
  const splitAuth = bearer.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
}

export async function handlerNewToken(req: Request, res: Response) {
  const refreshToken: string = getBearerToken(req);
  const user = await getUserFromRefreshToken(refreshToken);

  if (!user || user.expiresAt < new Date(Date.now()) || user.revokedAt) {
    throw new UnauthorizedError("unauthorized to create new refresh token");
  }
  const newAccessToken = makeJWT(
    user.userId,
    config.tokenConfig.accessTokenExpiration,
    config.tokenConfig.jwtSecret,
  );
  res.status(200).json({ token: newAccessToken });
}

export async function handlerRevokeRefreshToken(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  const result = await setTokenRevoked(refreshToken);
  res.status(204).send();
}
