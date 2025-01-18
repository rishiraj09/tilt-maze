import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { router } from "expo-router";

// context
import { AuthContext } from "@/contexts/AuthContext";
import { GameContext } from "@/contexts/GameContext";

// images
import { images } from "../../constants/images";

// components
import GameComponent from "@/components/GameComponent";
import StartGame from "@/components/StartGame";

const Play = () => {
  const { user } = useContext(AuthContext);
  const { isStarted, setIsStarted, gameModal, setGameModal, game, startGame } =
    useContext(GameContext);

  useEffect(() => {
    setIsStarted(false);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={gameModal} transparent={true}>
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            {game.status === "completed" ? (
              <>
                <Text style={styles.modalTextLarge}>Congratulations!</Text>
                <Image
                  source={images.firework}
                  resizeMode="contain"
                  style={styles.image}
                />
                <Text style={styles.modalTextRegular}>
                  You have completed the maze in {game.timer}!
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setGameModal(false);
                    router.replace("/home");
                  }}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </>
            ) : game.status === "exited" ? (
              <>
                <Text style={styles.modalTextLarge}>Play Again!</Text>
                <Image
                  source={images.restart}
                  resizeMode="contain"
                  style={styles.image}
                />
                <Text style={styles.modalTextRegular}>
                  Do you want to restart the game again ?
                </Text>
                <View style={styles.modalButtonHolder}>
                  <TouchableOpacity
                    style={styles.modalBtnSmall}
                    onPress={() => {
                      setGameModal(false);
                      setIsStarted(false);
                      router.replace("/home")
                    }}
                  >
                    <Text>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtnSmall, styles.restart]}
                    onPress={() => {
                      setGameModal(false);
                      setIsStarted(true);
                      startGame(user?.id);
                    }}
                  >
                    <Text style={{
                      color: "white"
                    }}>Restart</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              ""
            )}
          </View>
        </View>
      </Modal>
      {isStarted ? <GameComponent /> : <StartGame />}
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  modalTextLarge: {
    fontSize: 25,
    fontWeight: "bold",
  },
  modalTextRegular: {
    fontSize: 14,
    fontWeight: 500,
  },
  image: {
    width: 80,
    height: 80,
  },
  modalButtonHolder: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  modalButton: {
    width: 200,
    height: 40,
    backgroundColor: "#f1f1f1",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 10,
  },
  modalBtnSmall:{
    width: 130,
    height: 40,
    backgroundColor: "#f1f1f1",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 10,
  },
  restart:{
    // backgroundColor :"#0d1023",
    backgroundColor :"red"
  },
  
});

export default Play;
