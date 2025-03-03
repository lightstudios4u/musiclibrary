import { NextApiRequest, NextApiResponse } from "next";
import type { Request, Response } from "express";
import multer from "multer";
// import { Readable } from "stream";
// import fs from "fs";

// Multer Configuration (Temporary storage before upload)
const upload = multer({ dest: "/tmp/" });

// Convert Multer middleware to a Next.js-compatible function
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: Request, res: Response, next: (result?: unknown) => void) => void
) {
  return new Promise((resolve, reject) => {
    fn(
      req as unknown as Request,
      res as unknown as Response,
      (result: unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      }
    );
  });
}

// Middleware function for handling file uploads
export const uploadMiddleware = upload.single("file");
