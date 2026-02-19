import type { Request, Response } from "express";
import prisma from "../DB/primsa.ts";
import logger from "../utils/logger.ts";


export const postCreate = async(req: Request, res: Response)=>{

    try {
        const {title,description} = req.body
    
         if (!title || !description) {
            return res.status(400).json({ message: "fields required" });
          }
    
          const createPost = await prisma.post.create({
            data:{
               title ,
               description,
               userId:(req as any).user.id
            },
          })
    
          return res.status(201).json({
          message: "Post created",
          data: createPost,
        });
    } catch (error) {
        logger.error(`post error: ${error}`);
        return res.status(500).json({
      message: "Server error",
    })
    }

}
