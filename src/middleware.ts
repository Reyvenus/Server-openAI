import { NextFunction, Request, Response } from "express"
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { FileNameCallback } from "./interface";


export const verifyHeader = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["middleware"] !== process.env.MIDDLEWARE)
    res.status(401).send("no autorizado");
  else next()
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    try {
      const uniqueSuffix = "test-audio";
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      console.log("***************")
    } catch (error) {
      console.log("ERRORMULTER", error)
    }
  }
});

export const uploadAudio = multer();


