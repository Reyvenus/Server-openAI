import { NextFunction, Request, Response } from "express"


export const verifyHeader = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["middleware"] !== process.env.MIDDLEWARE)
        res.status(401).send("no autorizado");
    else next()
};
