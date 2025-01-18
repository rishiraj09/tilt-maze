import { createContext, ReactNode, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
// api util
import api from "@/config/api";

// interface
import { RankedList } from "@/interfaces/RankFeed";

interface GameData{
  id: string | null;
  status: string;
  timer: string | null;
  time_in_second: number | null;
  collision: number
}
interface GameContext {
  game: GameData;
  setGame: any;
  startGame: any;
  endGame: any;
  exitGame: any;
  isStarted: boolean;
  setIsStarted: any;
  gameModal: boolean;
  setGameModal: any;
  rankedlist: RankedList[],
  loading: boolean;
  fetchRankFeed:any;
}


export const GameContext = createContext<GameContext>({
  game: {
    id: null,
    status: "in-progress",
    timer: null,
    time_in_second: null,
    collision: 0
  },
  setGame: () =>{},
  startGame: ()=>{},
  endGame: ()=>{},
  exitGame: ()=>{},
  isStarted: false,
  setIsStarted: ()=>{},
  gameModal: false,
  setGameModal: ()=>{},
  rankedlist: [],
  loading: true,
  fetchRankFeed: ()=>{},
});

type GameContextProviderProps = {
  children: ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [game, setGame] = useState<GameData>({
    id: null,
    status: "in-progress",
    timer: null,
    time_in_second: null,
    collision: 0
  })
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [gameModal, setGameModal] = useState<boolean>(false);
  const [rankedlist, setRankedlist] = useState<RankedList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const startGame = async (userId: string) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if(!token){
        return {
          success:false,
          error: "Invalid token"
        }
      }
      // api call to create game data here
      const res = await api.post("/game/create",{
        userid: userId
      },{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
      if(res.status === 200 && res.data.success === true){
        // intialize all the game data
        setGame({
          id: res.data.game._id.toString().trim(),
          status: "in-progress",
          timer: "00:00",
          time_in_second: 0,
          collision: 0
        })
        setIsStarted(true)
      }
      
    } catch (error) {
      console.log("Error starting game", error);
    }
  };
  const endGame = async (timer: string, timeInSecond: number) => {
    try {
      // api call to create game data here
      const token = await SecureStore.getItemAsync("token");
      if(!token){
        return {
          success:false,
          error: "Invalid token"
        }
      }
      setGame({
        ...game,
        timer: timer,
        time_in_second: timeInSecond,
        status: "completed"
      })
      const res = await api.put("/game/save",{
        id: game.id,
        timer: timer,
        time_in_second:timeInSecond,
        collision: game.collision
      },{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }}
      )
      if(res.status === 200 && res.data.success === true){
        setGameModal(true);
        setIsStarted(false)
      }
    } catch (error) {
      console.log("Error starting game", error);
    }
  };
  const exitGame = async (timer: string, timeInSecond: number) => {
    try {
      // api call to create game data here
      const token = await SecureStore.getItemAsync("token");
      if(!token){
        return {
          success:false,
          error: "Invalid token"
        }
      }
      setGame({
        ...game,
        timer: timer,
        status: "exited",
        time_in_second: timeInSecond
      })
      const res = await api.put("/game/exit",{
        id: game.id,
        timer: timer,
        time_in_second:timeInSecond,
        collision: game.collision
      },{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }}
      )
      if(res.status === 200 && res.data.success === true){
        setGameModal(true);
        setIsStarted(false)
      }
    } catch (error) {
      console.log("Error starting game", error);
    }
  };

  const fetchRankFeed = async() =>{
    try {
      setLoading(true)
      const token = await SecureStore.getItemAsync("token");
      if(!token){
        return {
          success:false,
          error: "Invalid token"
        }
      }
      const res = await api.get("/game/feed",{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
      if(res.status === 200 && res.data.success === true){
        setRankedlist(res.data.rankedlist)
      }
    } catch (error) {
      console.log("Error fetching ranked list");
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    console.log(rankedlist)
  },[rankedlist])


  const contextData = {
    game,
    setGame,
    startGame,
    endGame,
    exitGame,
    isStarted,
    setIsStarted,
    gameModal,
    setGameModal,
    rankedlist,
    loading,
    fetchRankFeed
  };

  return (
    <GameContext.Provider value={contextData}>{children}</GameContext.Provider>
  );
};
