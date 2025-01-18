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
  handleSignin: any;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  handleSignin: () => {},
});

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
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

  }

  const contextData = {
    user,
    handleSignin,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
