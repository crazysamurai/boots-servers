import { Request, Response } from "express";
import { jsonData } from "./json.js";
import { cleanup } from "./profane.js";
import { BadRequestError } from "../middleware/middlewareErrorHandler.js";

type Chirp = {
  body: string;
};

//using express.json() to build the request body
export async function handlerChirpValidator(req: Request, res: Response) {
  const MAX_CHIRP_LENGTH = 140;

  let chirp: Chirp = req.body;

  if (chirp.body.length > MAX_CHIRP_LENGTH) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`,
    );
  } else {
    const cleanedMessage = cleanup(chirp.body);
    const valid = {
      cleanedBody: cleanedMessage,
    };
    jsonData(res, valid, 200);
  }
}

//manually parsing/building the request body using streams
// export async function handlerChirpValidator(req: Request, res: Response) {
//   const MAX_CHIRP_LENGTH = 140;
//
//   let body = "";
//   let chirp: Chirp;
//   req.on("data", (chunk) => {
//     body += chunk;
//   });
//   req.on("end", () => {
//     try {
//       chirp = JSON.parse(body);
//     } catch (err) {
//       const error: Error = { error: "Something went wrong" };
//       jsonData(res, error, 400);
//       return;
//     }
//     if (chirp.body.length > MAX_CHIRP_LENGTH) {
//       const error: Error = {
//         error: "Chirp is too long",
//       };
//       jsonData(res, error, 400);
//     } else {
//       const valid = {
//         valid: true,
//       };
//       jsonData(res, valid, 200);
//     }
//   });
// }
