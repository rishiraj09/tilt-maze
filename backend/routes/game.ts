import express from "express";

// middlewares
import { isLoggedIn } from "../middlewares/user";

// controllers
import {
  getGameFeed,
  createNewGame,
  saveGame,
  exitGame,
} from "../controllers/gameController";

const router = express.Router();

router.route("/feed").get(isLoggedIn, getGameFeed);

router.route("/create").post(isLoggedIn, createNewGame);

router.route("/save").put(isLoggedIn, saveGame);

router.route("/exit").put(isLoggedIn, exitGame);
export default router;
