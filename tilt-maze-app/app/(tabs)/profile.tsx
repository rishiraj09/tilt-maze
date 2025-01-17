import React, { useEffect, useContext } from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

// context
import { GameContext } from "@/contexts/GameContext";

const Profile = () => {
  const { isStarted, setIsStarted } = useContext(GameContext);

  useEffect(() => {
    setIsStarted(false);
  }, []);
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
});

export default Profile;
