import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import Maze from "./Maze";

// icon
import IconEntypo from "react-native-vector-icons/Entypo";

// context
import { GameContext } from "@/contexts/GameContext";

const ballRadius = 15;
const maxStep = 5; // Maximum distance to move per step for collision checking

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  vx: number;
  vy: number;
}

interface Wall {
  left: number;
  top: number;
  width: number;
  height: number;
  isGoal?: boolean;
}

const GameComponent = () => {
  const { setIsStarted, endGame, exitGame, game, setGame } =
    useContext(GameContext);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState<Velocity>({ vx: 0, vy: 0 });
  const [walls, setWalls] = useState<Wall[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [collidingWalls, setCollidingWalls] = useState<Set<number>>(new Set());
  const [collideCount, setCollideCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [hasReachedGoal, setHasReachedGoal] = useState<boolean>(false);

  const [sensitivity, setSensitivity] = useState(Platform.OS === 'ios' ? 2 : 8);

  // Add this new state to track if initial position has been set
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);
  // Modify the useEffect to set initial position when dimensions are available
  useEffect(() => {
    if (
      containerDimensions.width > 0 &&
      containerDimensions.height > 0 &&
      !isInitialPositionSet
    ) {
      const mazeSize = containerDimensions.width;
      const verticalOffset = (containerDimensions.height - mazeSize) / 2;

      setPosition({
        x: ballRadius * 2, // Give some padding from the left wall
        y: verticalOffset + ballRadius * 2, // Position relative to maze top
      });

      setIsInitialPositionSet(true);
    }
  }, [containerDimensions, isInitialPositionSet]);

  useEffect(() => {
    if (containerDimensions.width === 0 || containerDimensions.height === 0)
      return;

    const wallThickness = 10;

    // Make the maze square by using the smaller dimension
    const mazeSize = containerDimensions.width;
    const gridSize = 6;
    const cellSize = mazeSize / gridSize;

    // Calculate vertical offset for centering the maze
    const verticalOffset = (containerDimensions.height - mazeSize) / 2;
    const mazeWalls: Wall[] = [];

    // Outer walls
    mazeWalls.push(
      {
        left: 0,
        top: verticalOffset,
        width: mazeSize,
        height: wallThickness,
      },
      {
        left: 0,
        top: verticalOffset + mazeSize - wallThickness,
        width: mazeSize,
        height: wallThickness,
      },
      {
        left: 0,
        top: verticalOffset,
        width: wallThickness,
        height: mazeSize,
      },
      {
        left: mazeSize - wallThickness,
        top: verticalOffset,
        width: wallThickness,
        height: mazeSize,
      }
    );

    // Internal walls
    const addWall = (x: number, y: number, width: number, height: number) => {
      mazeWalls.push({
        left: x * cellSize,
        top: verticalOffset + y * cellSize,
        width: width === 0 ? wallThickness : width * cellSize,
        height: height === 0 ? wallThickness : height * cellSize,
      });
    };

    // Create a more challenging path
    // Vertical walls
    addWall(1, 0, 0, 2); // Block immediate left path
    addWall(2, 1, 0, 3); // Long vertical in left section
    addWall(3, 0, 0, 2); // Upper middle section
    addWall(4, 1, 0, 2); // Right section upper
    addWall(1, 3, 0, 2); // Lower left
    addWall(3, 3, 0, 2); // Lower middle
    addWall(4, 4, 0, 2); // Lower right
    addWall(2, 4, 0, 2); // Additional lower barrier
    addWall(3, 1, 0, 1);
    addWall(4, 3, 0, 1);

    // Horizontal walls
    addWall(1, 0, 1, 0); // Upper section
    addWall(3, 1, 0, 0);
    addWall(0, 2, 0, 0); // Left section
    addWall(3, 2, 0, 0); // Right section
    addWall(1, 3, 0, 0); // Middle section
    addWall(4, 3, 0, 0);
    addWall(0, 4, 1, 0); // Lower section
    addWall(2, 4, 0, 0);
    addWall(5, 1, 1, 0);
    addWall(5, 3, 1, 0);
    addWall(4, 4, 1, 0);
    addWall(5, 5, 1, 0);

    // Additional walls for dead ends and complexity
    addWall(1, 0, 1, 0); // Extra barriers
    addWall(4, 2, 1, 0);
    addWall(2, 3, 0, 0);
    addWall(3, 4, 1, 0);

    setWalls(mazeWalls);
  }, [containerDimensions]);

  // ******* Accelerometer operation **********
  useEffect(() => {

    const threshold = 0.1;

    const subscription = Accelerometer.addListener((data) => {
      const { x, y } = data;

      // Platform-specific calculations
      const adjustedX = Platform.OS === "ios" ? x : -x;
      const adjustedY = Platform.OS === "ios" ? y : -y;

      const smoothingFactor = 0.3;

      setVelocity((prev) => ({
        vx:
          Math.abs(x) > threshold
            ? prev.vx + adjustedX * sensitivity * (1 - smoothingFactor)
            : prev.vx,
        vy:
          Math.abs(y) > threshold
            ? prev.vy - adjustedY * sensitivity * (1 - smoothingFactor)
            : prev.vy,
      }));
    });

    return () => subscription && subscription.remove();
  }, []);

  useEffect(() => {
    const friction = 0.9;
    let animationFrame: number;

    const updatePosition = () => {
      setPosition((prev) => {
        // Calculate total movement for this frame
        let totalDx = velocity.vx;
        let totalDy = velocity.vy;
        let currentX = prev.x;
        let currentY = prev.y;
        let remainingSteps = Math.ceil(
          Math.sqrt(totalDx * totalDx + totalDy * totalDy) / maxStep
        );

        // Break movement into smaller steps
        while (remainingSteps > 0) {
          const stepX = totalDx / remainingSteps;
          const stepY = totalDy / remainingSteps;

          const nextX = Math.max(
            ballRadius,
            Math.min(containerDimensions.width - ballRadius, currentX + stepX)
          );
          const nextY = Math.max(
            ballRadius,
            Math.min(containerDimensions.height - ballRadius, currentY + stepY)
          );

          // Check collision for this step
          const collisionResult = detectCollision(
            nextX,
            nextY,
            { vx: stepX, vy: stepY },
            currentX,
            currentY
          );

          currentX = collisionResult.x;
          currentY = collisionResult.y;

          // If we hit something, stop moving in that direction
          if (collisionResult.collision) {
            totalDx = collisionResult.velocity.vx;
            totalDy = collisionResult.velocity.vy;
            break;
          }

          remainingSteps--;
        }

        return { x: currentX, y: currentY };
      });

      setVelocity((prev) => ({
        vx: prev.vx * friction,
        vy: prev.vy * friction,
      }));

      animationFrame = requestAnimationFrame(updatePosition);
    };

    animationFrame = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationFrame);
  }, [velocity, containerDimensions]);

  useEffect(() => {
    setGame({
      ...game,
      collision: collideCount,
    });
  }, [collideCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev: number) => prev + 1);
    }, 1000);
    setTimerInterval(interval);

    return () => clearInterval(interval); // Cleanup timer on component unmount
  }, []);

  useEffect(() => {
    if (containerDimensions.width && !hasReachedGoal) {
      const mazeSize = containerDimensions.width;
      const gridSize = 6;
      const cellSize = mazeSize / gridSize;
      const yOffset = (containerDimensions.height - mazeSize) / 2;

      // Calculate goal cell position (6,6) - bottom right cell
      const goalCellX = 5 * cellSize; // 0-based index, so 5 for 6th cell
      const goalCellY = yOffset + 5 * cellSize;

      // check if the ball is in goal
      if (
        position.x >= goalCellX &&
        position.x <= goalCellX + cellSize &&
        position.y >= goalCellY &&
        position.y <= goalCellY + cellSize
      ) {
        setHasReachedGoal(true);
        stopTimer();
        endGame(formatTime(timer), timer);
      }
    }
  }, [position, containerDimensions, hasReachedGoal, timer]);

  const detectCollision = (
    x: number,
    y: number,
    velocity: Velocity,
    prevX: number,
    prevY: number
  ) => {
    let newX = x;
    let newY = y;
    let newVelocity = { ...velocity };
    let collision = false;
    const currentCollidingWalls = new Set<number>();

    walls.forEach((wall, index) => {
      const ballLeft = x - ballRadius;
      const ballRight = x + ballRadius;
      const ballTop = y - ballRadius;
      const ballBottom = y + ballRadius;

      const wallLeft = wall.left;
      const wallRight = wall.left + wall.width;
      const wallTop = wall.top;
      const wallBottom = wall.top + wall.height;

      if (
        ballRight > wallLeft &&
        ballLeft < wallRight &&
        ballBottom > wallTop &&
        ballTop < wallBottom
      ) {
        collision = true;
        currentCollidingWalls.add(index);

        const prevBallLeft = prevX - ballRadius;
        const prevBallRight = prevX + ballRadius;
        const prevBallTop = prevY - ballRadius;
        const prevBallBottom = prevY + ballRadius;

        if (prevBallRight <= wallLeft) {
          newX = wallLeft - ballRadius;
          newVelocity.vx = 0;
        } else if (prevBallLeft >= wallRight) {
          newX = wallRight + ballRadius;
          newVelocity.vx = 0;
        }

        if (prevBallBottom <= wallTop) {
          newY = wallTop - ballRadius;
          newVelocity.vy = 0;
        } else if (prevBallTop >= wallBottom) {
          newY = wallBottom + ballRadius;
          newVelocity.vy = 0;
        }
      }
    });

    // Update collision count if a new collision is detected
    currentCollidingWalls.forEach((index) => {
      if (!collidingWalls.has(index)) {
        setCollideCount((prev) => prev + 1);
      }
    });
    setCollidingWalls(currentCollidingWalls);

    return { x: newX, y: newY, velocity: newVelocity, collision };
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerDimensions({ width, height });
      }}
  
    >
      <TouchableOpacity
        style={styles.exitBtn}
        onPress={() => {
          exitGame(formatTime(timer), timer);
          setIsStarted(false);
        }}
      >
        <Text style={styles.exitText}>
          <IconEntypo name="chevron-thin-left" size={17} color="black" />
          Exit Game
        </Text>
      </TouchableOpacity>
      <View style={styles.gameNameHolder}>
        <Text style={styles.tiltText}>Tilt</Text>
        <Text style={styles.titleText}>Maze</Text>
      </View>
      <Text style={styles.instruction}>
        Tilt your phone to move the ball inside the maze
      </Text>
      <Maze walls={walls} />
      <View
        style={[
          styles.ball,
          {
            transform: [
              { translateX: position.x - ballRadius },
              { translateY: position.y - ballRadius },
            ],
          },
        ]}
      />
      <View style={styles.timer}>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      </View>
      <View style={styles.collisionData}>
        <Text style={styles.collisionText}>Collision: {collideCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    boxSizing: "border-box",
    position: "relative",
  },
  ball: {
    width: ballRadius * 2,
    height: ballRadius * 2,
    borderRadius: ballRadius,
    backgroundColor: "blue",
    position: "absolute",
  },
  exitBtn: {
    height: 25,
    position: "absolute",
    top: 10,
    left: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "red",
  },
  exitText: {
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  gameNameHolder: {
    width: "100%",
    position: "absolute",
    top: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  tiltText: {
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "red",
  },
  titleText: {
    fontSize: 25,
    fontWeight: 400,
  },
  instruction: {
    position: "absolute",
    top: 75,
    width: "100%",
    textAlign: "center",
  },
  timer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 110,
  },
  timerText: {
    fontSize: 25,
    fontWeight: 600,
  },
  collisionData: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 80,
  },
  collisionText: {
    fontSize: 20,
    fontWeight: 600,
  },
});

export default GameComponent;
