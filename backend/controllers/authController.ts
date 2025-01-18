import { Request, Response } from "express";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

// models
import User from "../model/user";

interface DecodedToken {
  id: string;
  email: string;
}

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(402).json({
        success: false,
        error: "email-exist",
        message: "Email already exists!",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      name,
      email,
      encrypted_password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created!",
      user,
    });
  } catch (error) {
    console.error("Could not sign up user", error);
    return res.status(500).json({
      success: false,
      message: "Could not sign up user",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array({ onlyFirstError: true }),
      });
    }
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        error: "Invalid Credential",
        message: "Enter valid credential.",
      });
    }
    

    const user = await User.findOne({ email }).select("+encrypted_password");
    if (!user) {
      return res.status(402).json({
        success: false,
        error: "Invalid Account",
        message: "Account does not exists!",
      });
    }

    const isPaswordValid = await bcryptjs.compare(
      password,
      user.encrypted_password
    );
    if (!isPaswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid Credential",
        message: "Enter valid credential.",
      });
    }


    // handle cookie and user session here
    const jwt_secret = process.env.JWT_SECRET!;
    const token = jwt.sign({ id: user._id, email: user.email }, jwt_secret, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  
    const cookie_time = process.env.COOKIE_TIME || "60";
    const options = {
      expires: new Date(
        Date.now() + parseInt(cookie_time) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    const userinfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      return res.status(200).cookie("token", token, options).json({
        success: true,
        token: token,
        user: userinfo,
      });
  } catch (error) {
    console.error("Could not sign in user", error);
    return res.status(500).json({
      success: false,
      message: "Could not sign in user",
    });
  }
};

export const fetchUserSession = async (req: Request, res: Response) =>{
  const token = req.query.token;
  try {
    if(!token || token === "none" || token === null){
      return res.status(401).json({
        success:false,
        error: "Invalid token payload",
        message: "Logging out"
      })
    }
    const decoded = jwt.decode(token as string) as JwtPayload | null;
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
        message: "Logging out",
      });
    }
    const validToken = jwt.verify(token as string, process.env.JWT_SECRET as string);
    if(!validToken){
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
        message: "Logging out",
      });
    }
    const userId = (decoded as DecodedToken).id;
    const user = await User.findById(userId);
    if(!user){
      return res.status(401).json({
        success:false,
        error: "Invalid token payload",
        message: "Logging out",
      })
    }
    let userinfo = {
      id: user.id.toString().trim(),
      name: user.name,
      email: user.email,
      token: token
    }
    return res.status(200).json({
      success:true,
      user: userinfo
    })
  } catch (error) {
    console.error("Could not fetch user session",error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch user session"
    })
  }
}