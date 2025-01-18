import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  email: string;
}

interface CustomRequest extends Request {
  user?: any;
}

export const isLoggedIn = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined = undefined;
    const webtoken = req.cookies.token as string | undefined;
    const apitoken = req.header("Authorization")?.replace("Bearer ", "");
    if (webtoken) {
      token = webtoken;
    } else if (apitoken) {
      token = apitoken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        access: false,
        message: "Login to continue",
      });
    }

    const jwt_secret = process.env.JWT_SECRET || "vyoub!KSeC";
    const decoded = jwt.verify(token, jwt_secret) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.clearCookie("token",{
        secure:true,
        sameSite: "none"
    })
    .status(500)
    .json({
        success:false,
        access:false,
        message: "Inter server error"
    })
  }
};
