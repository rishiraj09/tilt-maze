import { createContext, ReactNode, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

// api lib
import api from "@/config/api";


interface UserData {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContext {
  user: UserData | null;
  loading: boolean;
  handleSignin: any;
  handleSignup:any;
  handleLogoutUser: any;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  loading: true,
  handleSignin: () => {},
  handleSignup: () => {},
  handleLogoutUser: () =>{},
});

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(()=>{
    fetchUserSession()
  },[])

  const fetchUserSession = async() =>{
    try {
      setLoading(true)
      const token = await SecureStore.getItemAsync("token");
      if(token === null){
        console.log("User not logged in");
        setUser(null);
      }else{
        const res = await api.get(`/auth/session?token=${token}`);
        if(res.status === 200 && res.data.success === true){
          setUser(res.data.user)
        }
      }
    } catch (error:any) {
      console.log("Errro fetching user session")
      if(error.status === 401 || error.status === 500){
        setUser(null)
      }
    }finally{
      setLoading(false)
    }
  }

  const handleSignin = async (formdata: {
    email: string;
    password: string;
  }) => {
    try {
      const res = await api.post("/auth/signin", formdata);
      if(res.status === 200 && res.data.success === true){
        setUser({
            id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            token: res.data.token
        })
        await SecureStore.setItemAsync("token", res.data.token);
        return {
            success:true,
            user
        }
      }
    } catch (error: any) {
      if (error.status === 400 || error.status === 401) {
        return {
            success:false,
            error: "Invalid Credential",
            message: "Enter valid credential!"
        }
      } else if (error.status === 402) {
        return {
            success:false,
            error: "Invalid Account",
            message: "Account does not exists!"
        }
      } else if (error.status === 500) {
        return {
            success:false,
            error: "Internal Error",
            message: "Something went wrong"
        }
      }
    }
  };

  const handleSignup = async(formdata: {
    name: string;
    email: string;
    password: string;
  }) =>{
    try {
      const res = await api.post("/auth/signup", formdata);
      if(res.status === 200 && res.data.success === true){
        return {
          success:true,
          message: "Account created successfully"
        }
      }
    } catch (error:any) {
      if (error.status === 400 || error.status === 401) {
        return {
            success:false,
            error: "Invalid Credential",
            message: "Enter valid credential!"
        }
      } else if (error.status === 402) {
        return {
            success:false,
            error: "Account Exists",
            message: "Account already exists!"
        }
      } else if (error.status === 500) {
        return {
            success:false,
            error: "Internal Error",
            message: "Something went wrong"
        }
      }
    }
  }

  const handleLogoutUser = async() =>{
    try {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
      return {
        success:true
      }
    } catch (error) {
      console.log("Error logging out user")
    }
  }

  useEffect(() =>{
    console.log(user)
  },[user])

  const contextData = {
    user,
    loading,
    handleSignin,
    handleSignup,
    handleLogoutUser
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
