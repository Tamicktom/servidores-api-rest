//* Libraries imports
import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import z from "zod";

import env from "../variables";

const authorizationSchema = z.string().nonempty();

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ error: "Unauthorized" }).end();

  const authorizationValidated = authorizationSchema.parse(authorization);

  const [, token] = authorizationValidated.split(" ");

  if (!token) return res.status(401).json({ error: "Unauthorized" }).end();

  try {
    const { sub } = verify(token, env.JWT_SECRET);

    if (!sub) return res.status(401).json({ error: "Unauthorized" }).end();

    console.log(sub);
    console.log("User authenticated");

    const subString = typeof sub === "string" ? sub : sub.toString();
    req.user_id = subString;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" }).end();
  }
}
