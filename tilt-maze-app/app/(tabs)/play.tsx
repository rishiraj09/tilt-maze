import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image
} from "react-native";

// context
import { GameContext } from "@/contexts/GameContext";

// images
import {images} from "../../constants/images";

// components
import GameComponent from "@/components/GameComponent";

const Play = () => {
  const { isStarted, setIsStarted, startGame, gameModal, setGameModal, timer } =
    useContext(GameContext);

  useEffect(() => {
    setIsStarted(false);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={gameModal} transparent={true}>
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTextLarge}>
              Congratulations!
            </Text>
            <Image
              source={images.firework}
              resizeMode="contain"
              style={styles.image}
            />
            <Text style={styles.modalTextRegular}>
              You have completed the maze in {timer}!
            </Text>
            <TouchableOpacity style={styles.modalButton}
            onPress={()=>{
              setGameModal(false)
            }}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {isStarted ? (
        <GameComponent />
      ) : (
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsStarted(true);
              startGame("rishiraj");
            }}
          >
            <Text style={styles.text}>Start Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1023",
    // alignItems:"center",
    // justifyContent:"center"
  },
  buttonHolder: {
    flex: 1,
    width: "100%",
    // height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 250,
    height: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 6,
  },
  text: {
    fontSize: 18,
    fontWeight: 500,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    width: "90%",
    height: 300,
    backgroundColor: "white",
    borderRadius: 6,
    display:"flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  modalTextLarge:{
    fontSize: 25,
    fontWeight: "bold"
  },
  modalTextRegular:{
    fontSize: 14,
    fontWeight: 500
  },
  image:{
    width: 80,
    height: 80
  },
  modalButton:{
    width: 200,
    height: 40,
    backgroundColor: "#f1f1f1",
    display:"flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 10
  }
});

export default Play;
