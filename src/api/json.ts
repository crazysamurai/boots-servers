import { Response } from "express";

export function jsonData(res: Response, data: any, code: number) {
  // const msg = JSON.stringify(data);
  // res.header("Content-Type", "application/json");
  // console.log("DATA:" + data);
  res.status(code).json(data); //using res.json() automatically stringify and sets appropriate headers
}
