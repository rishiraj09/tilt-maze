import React, {useContext} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

// images
import { images } from "@/constants/images";

// context
import { GameContext } from '@/contexts/GameContext';
import { AuthContext } from '@/contexts/AuthContext';

const StartGame = () => {
    const {user} = useContext(AuthContext);
    const {setIsStarted, startGame} = useContext(GameContext);
    return (
        <View style={styles.container}>
                <View style={styles.titleHolder}>
                  <Text style={styles.textRed}>Tilt</Text>
                  <Text style={styles.textWhite}>Maze</Text>
                </View>
                <Image source={images.maze} resizeMode="contain" style={styles.image} />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setIsStarted(true);
                        startGame(user?.id);
                    }}
                  >
                    <Text style={styles.buttonText}>Start Game</Text>
                  </TouchableOpacity>
              </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
        width: "100%",
        // backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
      },
      titleHolder: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        marginBottom: 20,
      },
      textRed: {
        fontSize: 40,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "red",
      },
      textWhite: {
        fontSize: 40,
        fontWeight: "bold",
        color: "white"
      },
      image: {
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
        marginTop: 30,
      },
      buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: 600,
      },
})

export default StartGame;
