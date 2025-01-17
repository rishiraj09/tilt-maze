import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface Wall {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface MazeProps {
    walls: Wall[];
}

const Maze = ({walls}: MazeProps) => {
    return (
        <View style={styles.container}>
      {walls.map((wall, index) => (
        <View
          key={index}
          style={[
            styles.wall,
            {
              left: wall.left,
              top: wall.top,
              width: wall.width,
              height: wall.height,
            },
          ]}
        />
      ))}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    wall: {
      position: 'absolute',
      backgroundColor: 'black',
    },
  });

export default Maze;
