import { describe, it, expect, beforeAll } from "vitest";
import {
  hashPassword,
  checkPasswordHash,
  makeJWT,
  validateJWT,
  getBearerToken,
  getAPIKey,
} from "../src/api/auth.ts";
import { Request } from "express";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("create and validate jwt", () => {
  const userId = "alphabetsand12345";
  const secret = "somesecret";

  let token: string;
  let returnId: string;

  it("should be a valid token", () => {
    token = makeJWT(userId, 5, secret);
    returnId = validateJWT(token, secret);
    expect(returnId).toBe(userId);
  });

  it("should be expired", () => {
    token = makeJWT(userId, 0, secret);
    expect(() => {
      validateJWT(token, secret);
    }).toThrow("invalid token");
  });
});

describe("extract token from the Bearer", () => {
  const req = {
    headers: {
      authorization: "Bearer theActualTokenIsThisPart",
    },
  } as Partial<Request> as Request;

  it("should remove whitespace and bearer", async () => {
    const token = getBearerToken(req);
    expect(token).toBe("theActualTokenIsThisPart");
  });
});

describe("extract apiKey", () => {
  let req = {
    headers: {
      authorization: "ApiKey theActualKeyIsThisPart",
    },
  } as Partial<Request> as Request;

  it("should remove whitespace and ApiKey", async () => {
    const apiKey = getAPIKey(req);
    expect(apiKey).toBe("theActualKeyIsThisPart");
  });
});
