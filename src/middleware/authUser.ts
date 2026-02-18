import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express"; 
import logger from "../utils/logger.ts";
import prisma from "../DB/primsa.ts"

interface JwtPayloadType {
  user_id: string;
}

export const authUser =async(req:Request,res:Response,next:NextFunction): Promise<void>=> {
    try {
        
        const token =
      req.cookies.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const decoded = jwt.verify(token ,process.env.ACCESSTOKEN as string) as JwtPayloadType

  const user = await prisma.user.findUnique({
      where: { id: decoded.user_id }
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    (req as any).user = user; // attach user to request


    next();
    } catch (error) {
       logger.error("Auth middleware error", error);
         res.status(401).json({ message: "Invalid token" });
    }

}

// Record ek type helper hai jo object ka structure define karta hai.