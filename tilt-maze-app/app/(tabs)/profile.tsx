import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

// context
import { GameContext } from "@/contexts/GameContext";
import { AuthContext } from "@/contexts/AuthContext";

const Profile = () => {
  const router = useRouter();
  const { setIsStarted } = useContext(GameContext);
  const { handleLogoutUser } = useContext(AuthContext);
  useEffect(() => {
    setIsStarted(false);
  }, []);

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
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.text}>Profile Page</Text>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  logout: {
    width: 100,
    height: 40,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Profile;
