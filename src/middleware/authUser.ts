import User from "../model/user.model.ts"
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express"; 

export const authUser =async(req:Request,res:Response,next:NextFunction): Promise<void>=> {
    try {
        
        const token =
      req.cookies.accessToken?.value ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const decoded = jwt.verify(token ,process.env.ACCESSTOKEN as string)

  const user = await User.findById(decoded.user_id)
      .select("-password -refreshToken -__v");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    (req as any).user = user; // attach user to request

    next();
    } catch (error) {
         res.status(401).json({ message: "Invalid token" });
    }

}

