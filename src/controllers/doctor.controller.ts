import { redis } from "../config/redis.ts";
import prisma from "../DB/primsa.ts";
import logger from "../utils/logger.ts";
import type { Request, Response } from "express";



const  getDoctor = async(req:Request, res:Response)=> {

    try {
        const getDoctor = await prisma.doctor.findMany({
            select:{
                id:true,
                name:true,
                specialization:true
            }
        })
        res.json(getDoctor)
        
    } catch (error) {
        logger.error(`Auth error: ${error}`);
        console.log(error)
    }
}