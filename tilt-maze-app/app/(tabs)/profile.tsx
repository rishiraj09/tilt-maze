import React, { useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import FA6 from "react-native-vector-icons/FontAwesome6";
import AD from "react-native-vector-icons/AntDesign";
import * as SecureStore from "expo-secure-store";

// context
import { GameContext } from "@/contexts/GameContext";
import { AuthContext } from "@/contexts/AuthContext";

import api from "@/config/api";

// component
import RankListItem from "@/components/RankListItem";
import EmptyState from "@/components/EmptyState";

// interface
import { RankedList } from "@/interfaces/RankFeed";

const Profile = () => {
  const router = useRouter();
  const { setIsStarted } = useContext(GameContext);
  const { handleLogoutUser, user } = useContext(AuthContext);
  const [gamelist, setGamelist] = useState<RankedList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useFocusEffect(
    React.useCallback(() => {
      fetchUserGameLog();
      setIsStarted(false);
    }, [])
  );
  const fetchUserGameLog = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        return {
          success: false,
          error: "Invalid token",
        };
      }

      const res = await api.get(`/game/list/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200 && res.data.success === true) {
        let gamelog:any[] = [];
        if(res.data.gamelist.length > 0){
          res.data.gamelist.forEach((gm:RankedList)=>{
            gamelog.push({
              ...gm,
              user: user?.name
            })
          })
        }
        setGamelist(gamelog);
      }
    } catch (error) {
      console.log("Error fetching game log");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const res = await handleLogoutUser();
    if (res.success === true) {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0d1023",
      }}
    >
      <View style={styles.container}>
        <View style={styles.profileHolder}>
          <View style={styles.dpHolder}>
            <FA6 name="user-large" size={30} color="grey" />
          </View>
          <View style={styles.nameHolder}>
            <Text style={styles.fullname}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        <Text style={styles.gamelogText}>Your Game Log</Text>
        <FlatList
          data={gamelist}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <RankListItem item={item} index={index} />
          )}
          ListEmptyComponent={()=>(
            <EmptyState/>
          )}
        />
        <View style={styles.logoutHolder}>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={handleLogout}
          >
            <AD name="logout" size={15} color="white" />
            <Text style={styles.logouttext}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  profileHolder: {
    width: "100%",
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dpHolder: {
    width: 70,
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#424140",
    borderRadius: "50%",
  },
  nameHolder: {
    flex: 1,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    gap: 5,
  },
  fullname: {
    fontSize: 18,
    color: "white",
  },
  email: {
    fontSize: 14,
    color: "grey",
  },
  gamelogText: {
    width: "100%",
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  logouttext: {
    color: "white",
    fontSize: 15,
  },
  logoutHolder: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
});

export default Profile;
