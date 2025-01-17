import { createContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";

interface GameContext {
  gameId: string;
  status: string;
  timer: string;
  collisionCount: number;
  setCollisionCount: any;
  startGame: any;
  endGame: any;
  isStarted: boolean;
  setIsStarted: any;
  gameModal: boolean;
  setGameModal: any;
}

const API_URL = "/api/v1";

export const GameContext = createContext<GameContext>({
  gameId: "",
  status: "in_progress",
  timer: "00:00",
  collisionCount: 0,
  setCollisionCount: ()=>{},
  startGame: ()=>{},
  endGame: ()=>{},
  isStarted: false,
  setIsStarted: ()=>{},
  gameModal: false,
  setGameModal: ()=>{}
});

type GameContextProviderProps = {
  children: ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [gameId, setGameId] = useState<string>("");
  const [status, setStatus] = useState<string>("in-progress");
  const [timer, setTimer] = useState<string>("00:00");
  const [collisionCount, setCollisionCount] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [gameModal, setGameModal] = useState<boolean>(false);

  const startGame = async (userId: string) => {
    try {
      // api call to create game data here
      // intialize all the game data
      setGameId("12345");
      setCollisionCount(0)
    } catch (error) {
      console.log("Error starting game", error);
    }
  };
  const endGame = async (userId: string, timer: string) => {
    try {
      // api call to create game data here
      setTimer(timer);
      setStatus("completed");
      setGameModal(true);
      setIsStarted(false)
    } catch (error) {
      console.log("Error starting game", error);
    }
  };


  useEffect(()=>{
    console.log("Collision: ",collisionCount)
  },[collisionCount])

  const contextData = {
    gameId,
    status,
    timer,
    collisionCount,
    setCollisionCount,
    startGame,
    endGame,
    isStarted,
    setIsStarted,
    gameModal,
    setGameModal
  };

  return (
    <GameContext.Provider value={contextData}>{children}</GameContext.Provider>
  );
};
