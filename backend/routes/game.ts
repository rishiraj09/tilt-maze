import express from "express";

// middlewares
import { isLoggedIn } from "../middlewares/user";

// controllers
import {
  getGameFeed,
  createNewGame,
  saveGame,
  exitGame,
  getUserGameLog
} from "../controllers/gameController";

const router = express.Router();

router.route("/feed").get(isLoggedIn, getGameFeed);

router.route("/create").post(isLoggedIn, createNewGame);

router.route("/save").put(isLoggedIn, saveGame);

router.route("/exit").put(isLoggedIn, exitGame);

router.route("/list/:uid").get(isLoggedIn, getUserGameLog)

export default router;
