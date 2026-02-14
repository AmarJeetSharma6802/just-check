import type { Request, Response } from "express"; //"verbatimModuleSyntax": true
// import { Request, Response } from "express"; normal import  "verbatimModuleSyntax": false
// import user from "../model/user.model.js"
import logger from "../utils/logger.ts";

const auth = async (req: Request, res: Response): Promise<Response> => {
  try {

    logger.info("Auth endpoint called");

    const { name, email, password, action } = req.body;

    if (action === "register") {

      // throw new Error("Testing error logger");

      if (!name || !email || !password) {
        logger.warn("Register validation failed");
        return res.status(401).json({ message: "all fields are required" });
      }

      logger.info(`New register attempt: ${email}`);

      return res.status(201).json({ name, email, password });
    }

    if (action === "login") {
      logger.info(`Login attempt: ${email}`);
    }

    return res.status(200).json({ message: "ok" });

  } catch (error) {
    logger.error("Auth controller error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { auth };

// Case	Return type
// return res.json() karte ho	Promise<Response>
// sirf res.json() call karte ho	Promise<void>
