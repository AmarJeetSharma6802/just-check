import type { NextFunction, Request, Response } from "express"; 
import { redis } from "../config/redis.ts";
import logger from "./logger.ts";

export const rateLimit = async (req:Request, res:Response, next:NextFunction) => {
try {
    //   const ip = req.ip;
      const ip =  req.ip || req.socket.remoteAddress || "unknown";;
    
      const count = await redis.incr(`ratelimit:${ip}`);
    
      if (count === 1) await redis.expire(`ratelimit:${ip}`, 60);
    
      if (count > 100)
        return res.status(429).json({ message: "Too many requests" });
    
      next();
} catch (error) {
    logger.error("RateLimit error", error);
    res.status(401).json({ message: "RateLimit Error" });
}
};
