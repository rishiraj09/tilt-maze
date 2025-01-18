import express from "express";
import { body } from "express-validator";

// controllers

import {signup, signin} from "../controllers/authController";

const router = express.Router();

router
  .route("/signup")
  .post([
    body("name")
      .isLength({ min: 2, max: 80 })
      .withMessage("Name should be minimum of 2 characters"),
    body("email").isEmail().withMessage("Enter valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be minimum of 6 characters"),
  ], signup);

router.route("/signin")
  .post([
    body("email").isEmail().withMessage("Enter valid email"),
    body("password")
      .isLength({ min: 1 })
      .withMessage("Enter valid password"),
  ], signin)

export default router;
