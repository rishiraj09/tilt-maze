import { Request, Response } from "express";
import dotenv from "dotenv";
import moment = require("moment");

dotenv.config();

// models
import User from "../model/user";
import Game from "../model/game";

export const getGameFeed = async (req: Request, res: Response) => {
  try {
    let rankedlist: {
      id: string;
      user_id: string;
      user: string;
      timer: string;
      time_in_second: number;
      collision: number;
      createdAt: string;
    }[] = [];
    const games = await Game.find({
      status: "completed",
    })
      .sort({
        collision: 1,
        time_in_second: 1,
      })
      .limit(100);
    if (games.length > 0) {
      let uids: string[] = [];
      let gamelist: any[] = [];
      games.forEach((gm: any) => {
        if (!uids.includes(gm.user_id)) {
          uids.push(gm.user_id);
        }
        gamelist.push({
          id: gm._id.toString().trim(),
          user_id: gm.user_id,
          user: "",
          timer: gm.timer,
          time_in_second: gm.time_in_second,
          collision: gm.collision,
          createdAt: moment(gm.updatedAt).format("lll"),
        });
      });
      let users = await User.find().where("_id").in(uids);
      rankedlist = gamelist.map(
        (gm: {
          id: string;
          user_id: string;
          user: string;
          timer: string;
          time_in_second: number;
          collision: number;
          createdAt: string;
        }) => {
          let userIndex = users.findIndex(
            (usr: any) => usr._id.toString().trim() === gm.user_id.trim()
          );
          let name = "";
          if (userIndex >= 0) {
            name = users[userIndex].name;
          }
          return {
            ...gm,
            user: name,
          };
        }
      );
    }
    return res.status(200).json({
      success: true,
      rankedlist,
    });
  } catch (error) {
    console.error("Could not fetch game feed", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch game feed",
    });
  }
};

export const createNewGame = async (req: Request, res: Response) => {
  const { userid } = req.body;
  try {
    const game = await Game.create({
      user_id: userid,
      status: "in-progress",
    });
    return res.status(200).json({
      success: true,
      message: "New game created",
      game,
    });
  } catch (error) {
    console.error("Could not create new game", error);
    return res.status(500).json({
      success: false,
      message: "Could not create new game",
    });
  }
};

export const saveGame = async (req: Request, res: Response) => {
  const { id, timer, time_in_second, collision } = req.body;
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Invalid game id",
      });
    }
    game.timer = timer;
    game.time_in_second = time_in_second;
    game.collision = collision;
    game.status = "completed";
    await game.save();

    return res.status(200).json({
      success: true,
      message: "Game status saved",
    });
  } catch (error) {
    console.error("Could not save new game", error);
    return res.status(500).json({
      success: false,
      message: "Could not save new game",
    });
  }
};

export const exitGame = async (req: Request, res: Response) => {
  const { id, timer, time_in_second, collision } = req.body;
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Invalid game id",
      });
    }
    game.timer = timer;
    game.time_in_second = time_in_second;
    game.collision = collision;
    game.status = "exited";
    await game.save();

    return res.status(200).json({
      success: true,
      message: "Game status saved",
    });
  } catch (error) {
    console.error("Could not save new game", error);
    return res.status(500).json({
      success: false,
      message: "Could not save new game",
    });
  }
};

export const getUserGameLog = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const games = await Game.find({ user_id: uid })
      .sort({
        _id: -1,
      })
      .limit(80);
    let gamelist: any[] = [];
    if (games.length > 0) {
      games.forEach((gm: any) => {
        gamelist.push({
          id: gm._id.toString().trim(),
          user_id: gm.user_id,
          user: "",
          timer: gm.timer,
          time_in_second: gm.time_in_second,
          collision: gm.collision,
          createdAt: moment(gm.updatedAt).format("lll"),
        });
      });
    }
    return res.status(200).json({
      success: true,
      gamelist,
    });
  } catch (error) {
    console.error("Could not fetch game log", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch game log",
    });
  }
};
