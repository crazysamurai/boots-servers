import { NextFunction, Request, Response } from "express";
import { jsonData } from "../api/json.js";

//400
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

//401
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

//403
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

//404
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.log(err);
  let data = { error: "Internal Server Error" };
  let status = 500;

  if (err instanceof BadRequestError) {
    data = { error: err.message };
    status = 400;
  } else if (err instanceof UnauthorizedError) {
    data = { error: err.message };
    status = 401;
  } else if (err instanceof ForbiddenError) {
    data = { error: err.message };
    status = 403;
  } else if (err instanceof NotFoundError) {
    data = { error: err.message };
    status = 404;
  }

  jsonData(res, data, status);

  // res.status(500).json({ error: "Something went wrong on our end" });
  // jsonData(res, { error: "Something went wrong on our end" }, 500);
}
