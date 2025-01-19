## ***Tilt*** Maze
## Overview
The Tilt Maze Game is a React Native mobile application where players navigate a ball through a maze by tilting their device. The game uses the device's accelerometer sensor to control ball movement and includes features like collision detection, timer tracking, and wall interactions. Tilt Maze also comes with leaderboard dashboard to track the best game log of all the players.

#### Tech Stack
###### Backend 
1. Node Js
2. Express Js
3. Mongo Db
###### Frontend
1. Rect Native
2. Expo
##### Cloud Hosting
* DigitalOcean

### Screenshots

![Image](https://github.com/user-attachments/assets/fc50c987-6f6f-46fa-854a-60d1e9d4de20)

### System Architecture

![Image](https://github.com/user-attachments/assets/b1046910-be59-4eee-ac8c-a79f10645e69)

# Tilt Maze Game Documentation

## Game Components

### Maze Structure
- The maze is generated as a square grid (6x6)
- Walls are created with specific thickness (10 units)
- The maze includes outer boundary walls and internal maze walls
- The goal is positioned in the bottom-right cell of the maze

### Ball Properties
- Ball is represented as a circular object with a radius of 15 units
- Initial position: Top-left corner of the maze (after padding)
- Movement is controlled by device tilt
- Collisions with walls are detected and handled

## Accelerometer Implementation

### Sensor Data Processing
1. Raw accelerometer data consists of:
   - X-axis: Left/Right tilt
   - Y-axis: Forward/Backward tilt
   - Z-axis: Not used in game mechanics

2. Platform-specific adjustments:
   ```javascript
   const adjustedX = Platform.OS === "ios" ? x : -x;
   const adjustedY = Platform.OS === "ios" ? y : -y;
   ```
   - iOS and Android provide different accelerometer readings, requiring platform-specific handling
   - Sensitivity values: iOS = 2, Android = 8

### Movement Algorithm

1. **Velocity Calculation**
```javascript
// Threshold to prevent minor movements
const threshold = 0.1;

// Smoothing factor for fluid movement
const smoothingFactor = 0.3;

// Velocity update based on accelerometer data
setVelocity((prev) => ({
    vx: Math.abs(x) > threshold
        ? prev.vx + adjustedX * sensitivity * (1 - smoothingFactor)
        : prev.vx,
    vy: Math.abs(y) > threshold
        ? prev.vy - adjustedY * sensitivity * (1 - smoothingFactor)
        : prev.vy,
}));
```

2. **Position Update Algorithm**
```plaintext
1. Calculate total movement for current frame
2. Break movement into smaller steps (maxStep = 5)
3. For each step:
   a. Calculate stepX and stepY
   b. Determine next position within container bounds
   c. Check for collisions
   d. Update position if no collision
   e. Apply friction (0.9) to slow down movement
```

### Collision Detection System

1. For each potential ball position:
   - Check intersection with all maze walls
   - Calculate collision boundaries for ball and walls
   - Determine collision response (bounce direction)
   - Update collision counter if new collision detected

2. Collision Response:
   ```javascript
   if (collision) {
       // Stop movement in collision direction
       if (horizontal collision) velocity.vx = 0
       if (vertical collision) velocity.vy = 0
       // Position adjustment to prevent wall penetration
       position = calculateNewPosition()
   }
   ```

## Position Update Flow

1. **Input Phase**
   - Accelerometer provides tilt data (x, y coordinates)
   - Data is filtered through threshold check
   - Platform-specific adjustments are applied

2. **Physics Calculation**
   - Velocity is updated based on tilt
   - Smoothing is applied for fluid movement
   - Friction is applied to prevent infinite movement

3. **Position Update**
   - New position is calculated in steps
   - Boundaries are checked
   - Collisions are detected and handled
   - Final position is rendered

4. **Render Phase**
   - Ball position is updated using transform
   - Collision count is updated if necessary
   - Timer continues until goal is reached

## Game State Management

- Timer tracks gameplay duration
- Collision counter tracks wall hits
- Goal detection checks for successful completion
- Game state (position, velocity, collisions) updated in real-time

## Performance Considerations

1. **Movement Optimization**
   - Steps are broken down into smaller increments
   - Animation frames handle smooth updates
   - Collision detection optimized for performance

2. **State Management**
   - UseEffect hooks manage side effects
   - State updates are batched when possible
   - Component re-renders minimized

## Goal Detection

The game continuously monitors the ball's position relative to the goal area (bottom-right cell). When the ball enters this area:
1. Timer stops
2. Final score (time and collisions) is recorded
3. Game completion state is updated