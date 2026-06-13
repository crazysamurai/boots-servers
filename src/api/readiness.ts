import { Request, Response } from "express";

export async function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200);
  res.send("OK");
}

//this is what we call a handler function, they have a structure like (req: Request, res: Response) => Promise<void>;  Instead of returning a value all at once from the handler function, we write the response to the Response object. They process http requests and return appropriate response
