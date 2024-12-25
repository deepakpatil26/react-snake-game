/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import "./SnakeGame.css"; // Import the CSS file

const SnakeGame = () => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState("medium"); // Default difficulty is medium

  const GRID_SIZE = 20;
  const gameIntervalRef = useRef(null); // To store the interval ID

  // Adjust game speed based on difficulty level
  const getSpeed = () => {
    switch (difficulty) {
      case "slow":
        return 300; // Slow speed
      case "medium":
        return 200; // Medium speed
      case "fast":
        return 100; // Fast speed
      default:
        return 200;
    }
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isPlaying]);

  // Handle touch controls
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => isPlaying && direction !== "DOWN" && setDirection("UP"),
    onSwipedDown: () => isPlaying && direction !== "UP" && setDirection("DOWN"),
    onSwipedLeft: () =>
      isPlaying && direction !== "RIGHT" && setDirection("LEFT"),
    onSwipedRight: () =>
      isPlaying && direction !== "LEFT" && setDirection("RIGHT"),
  });

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = [...newSnake[newSnake.length - 1]];

      switch (direction) {
        case "UP":
          head[1] -= 1;
          break;
        case "DOWN":
          head[1] += 1;
          break;
        case "LEFT":
          head[0] -= 1;
          break;
        case "RIGHT":
          head[0] += 1;
          break;
        default:
          break;
      }

      newSnake.push(head);
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood([
          Math.floor(Math.random() * GRID_SIZE),
          Math.floor(Math.random() * GRID_SIZE),
        ]);
        setScore(score + 1);
      } else {
        newSnake.shift();
      }

      // Check for collision
      if (
        head[0] < 0 ||
        head[0] >= GRID_SIZE ||
        head[1] < 0 ||
        head[1] >= GRID_SIZE ||
        newSnake
          .slice(0, -1)
          .some((segment) => segment[0] === head[0] && segment[1] === head[1])
      ) {
        setGameOver(true);
        setIsPlaying(false);
      }

      setSnake(newSnake);
    };

    // Clear previous interval if it exists
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);

    // Set the new interval based on the selected difficulty
    gameIntervalRef.current = setInterval(moveSnake, getSpeed());

    return () => clearInterval(gameIntervalRef.current);
  }, [snake, direction, food, gameOver, isPlaying, difficulty]);

  // Start/Pause functionality
  const toggleGame = () => {
    if (gameOver) {
      setSnake([[5, 5]]);
      setFood([10, 10]);
      setDirection("RIGHT");
      setGameOver(false);
      setScore(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Difficulty change handler
  const changeDifficulty = (level) => {
    setDifficulty(level); // Change difficulty without pausing the game
  };

  // Disable scrolling when the game is active
  useEffect(() => {
    if (isPlaying) {
      document.body.style.overflow = "hidden"; // Disable scrolling during the game
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling after the game ends or is paused
    }

    // Cleanup: ensure scrolling is re-enabled when the component is unmounted or the game ends
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPlaying]);

  return (
    <div {...swipeHandlers} className="game-container">
      <h1>Snake Game</h1>
      <h2>Score: {score}</h2>
      <button onClick={toggleGame}>
        {gameOver ? "Restart" : isPlaying ? "Pause" : "Start"}
      </button>

      <div>
        <h3>Difficulty:</h3>
        <button onClick={() => changeDifficulty("slow")}>Slow</button>
        <button onClick={() => changeDifficulty("medium")}>Medium</button>
        <button onClick={() => changeDifficulty("fast")}>Fast</button>
      </div>

      <div className="grid-container">
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const isSnake = snake.some(
              (segment) => segment[0] === col && segment[1] === row
            );
            const isFood = food[0] === col && food[1] === row;
            return (
              <div
                key={`${row}-${col}`}
                className={`grid-cell ${
                  isSnake ? "snake" : isFood ? "food" : ""
                }`}
              />
            );
          })
        )}
      </div>
      {gameOver && <h3 className="game-over">Game Over!</h3>}
    </div>
  );
};

export default SnakeGame;
