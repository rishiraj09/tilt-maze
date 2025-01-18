import React, {useContext, useEffect} from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

// context
import { AuthContext } from "@/contexts/AuthContext";


// images
import {images} from "../constants/images";

const Index = () => {
  const {user} = useContext(AuthContext);
  useEffect(() =>{
    console.log(user)
  },[user])
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0d1023",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.titleHolder}>
          <Text style={styles.textRed}>Tilt</Text>
          <Text style={styles.textBlack}>Maze</Text>
        </View>
        <Image
          source={images.maze}
          resizeMode="contain"
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.replace("/sign-in");
          }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 400,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6
  },
  titleHolder:{
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 20
  },
  textRed:{
    fontSize: 40,
    fontWeight: "bold",
    fontStyle: "italic",
    color:"red"
  },
  textBlack:{
    fontSize: 40,
    fontWeight: "bold",
  },
  image:{
    width: 120,
    height: 120,
  },
  button: {
    width: 200,
    height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 6,
    marginTop: 30
  },
  buttonText:{
    color: "white",
    fontSize: 17,
    fontWeight: 600
  }
});

export default Index;
