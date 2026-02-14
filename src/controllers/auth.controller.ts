// import type { Request, Response } from "express"; //"verbatimModuleSyntax": true
// // import { Request, Response } from "express"; normal import  "verbatimModuleSyntax": false
// // import user from "../model/user.model.js"
// import logger from "../utils/logger.ts";

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../DB/primsa.ts";
import logger from "../utils/logger.ts";
import {redis} from "../config/redis.ts"

import transporter from "../utils/nodemailer.ts"

export const authHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password, otp, action } = req.body;

    /* ================= REGISTER ================= */
    if (action === "register") {
      if (!name || !email || !password) {
        logger.warn("Register failed: missing fields");
        return res.status(400).json({ message: "All fields required" });
      }

      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) {
        logger.warn(`Register failed: ${email} already exists`);
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otpCode, 10);

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          emailOtp: hashedOtp,
          emailOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      await transporter.sendMail({
        to: email,
        subject: "Verify your email",
        html: `<h3>Your OTP is <b>${otpCode}</b></h3>`,
      });

      logger.info(`User registered: ${email}`);

      return res.status(201).json({
        message: "Registered successfully. OTP sent",
        next: "verify_otp",
      });
    }

    /* ================= VERIFY OTP ================= */
    if (action === "verify_otp") {
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP required" });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.emailOtp || user.emailOtpExpires! < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
      }

      const isValid = await bcrypt.compare(otp, user.emailOtp);
      if (!isValid) {
        logger.warn(`Invalid OTP attempt: ${email}`);
        return res.status(400).json({ message: "Invalid OTP" });
      }

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESSTOKEN!,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESHTOKEN!,
        { expiresIn: "7d" }
      );

      await prisma.user.update({
        where: { email },
        data: {
          emailOtp: null,
          emailOtpExpires: null,
          refreshToken,
        },
      });

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      logger.info(`OTP verified: ${email}`);

      return res.json({
        message: "OTP verified. Logged in",
      });
    }

    /* ================= LOGIN ================= */
    if (action === "login") {
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`Invalid login attempt: ${email}`);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESSTOKEN!,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESHTOKEN!,
        { expiresIn: "7d" }
      );

      await prisma.user.update({
        where: { email },
        data: { refreshToken },
      });

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      logger.info(`Login success: ${email}`);

      return res.json({ message: "Login successful" });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    logger.error(`Auth error: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
};


// Case	Return type
// return res.json() karte ho	Promise<Response>
// sirf res.json() call karte ho	Promise<void>
