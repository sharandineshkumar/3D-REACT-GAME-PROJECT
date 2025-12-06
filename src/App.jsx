import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import GameScene from './components/GameScene';
import GameUI from './components/GameUI';
import WinOverlay from './components/WinOverlay';
import { LEVELS } from './data/levels';

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedMirror, setSelectedMirror] = useState(null);
  const [mirrors, setMirrors] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Initialize level
  useEffect(() => {
    const level = LEVELS[currentLevel - 1];
    if (level) {
      setMirrors(level.mirrors.map((m, i) => ({ ...m, id: i })));
      setHasWon(false);
      setMoveCount(0);
      setGameTime(0);
      setIsPlaying(true);
      setSelectedMirror(null);
    }
  }, [currentLevel]);

  // Game timer
  useEffect(() => {
    if (!isPlaying || hasWon) return;
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, hasWon]);

  const handleMirrorSelect = useCallback((mirrorId) => {
    setSelectedMirror(prev => prev === mirrorId ? null : mirrorId);
  }, []);

  const handleMirrorRotate = useCallback((mirrorId, axis, direction) => {
    setMirrors(prev => prev.map(mirror => {
      if (mirror.id === mirrorId) {
        const rotationStep = Math.PI / 12; // 15 degrees
        const newRotation = [...mirror.rotation];
        if (axis === 'y') {
          newRotation[1] += direction * rotationStep;
        } else if (axis === 'x') {
          newRotation[0] += direction * rotationStep;
        }
        return { ...mirror, rotation: newRotation };
      }
      return mirror;
    }));
    setMoveCount(prev => prev + 1);
  }, []);

  const handleMirrorMove = useCallback((mirrorId, axis, direction) => {
    setMirrors(prev => prev.map(mirror => {
      if (mirror.id === mirrorId) {
        const moveStep = 0.5;
        const newPosition = [...mirror.position];
        const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
        newPosition[axisIndex] += direction * moveStep;
        // Clamp position within bounds
        newPosition[axisIndex] = Math.max(-8, Math.min(8, newPosition[axisIndex]));
        return { ...mirror, position: newPosition };
      }
      return mirror;
    }));
    setMoveCount(prev => prev + 1);
  }, []);

  // Keyboard controls for mirror movement and rotation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMirror === null || hasWon) return;

      switch (e.key) {
        // Arrow keys for movement
        case 'ArrowLeft':
          e.preventDefault();
          handleMirrorMove(selectedMirror, 'x', -1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMirrorMove(selectedMirror, 'x', 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleMirrorMove(selectedMirror, 'z', -1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMirrorMove(selectedMirror, 'z', 1);
          break;
        // Q and E for rotation
        case 'q':
        case 'Q':
          e.preventDefault();
          handleMirrorRotate(selectedMirror, 'y', -1);
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          handleMirrorRotate(selectedMirror, 'y', 1);
          break;
        // W and S for vertical movement
        case 'w':
        case 'W':
          e.preventDefault();
          handleMirrorMove(selectedMirror, 'y', 1);
          break;
        case 's':
        case 'S':
          e.preventDefault();
          handleMirrorMove(selectedMirror, 'y', -1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMirror, hasWon, handleMirrorMove, handleMirrorRotate]);

  const handleWin = useCallback(() => {
    if (!hasWon) {
      setHasWon(true);
      setIsPlaying(false);
      setCompletedLevels(prev =>
        prev.includes(currentLevel) ? prev : [...prev, currentLevel]
      );
    }
  }, [hasWon, currentLevel]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < LEVELS.length) {
      setCurrentLevel(prev => prev + 1);
    }
  }, [currentLevel]);

  const handleResetLevel = useCallback(() => {
    const level = LEVELS[currentLevel - 1];
    if (level) {
      setMirrors(level.mirrors.map((m, i) => ({ ...m, id: i })));
      setHasWon(false);
      setMoveCount(0);
      setGameTime(0);
      setIsPlaying(true);
      setSelectedMirror(null);
    }
  }, [currentLevel]);

  const handleLevelSelect = useCallback((level) => {
    setCurrentLevel(level);
  }, []);

  const levelData = LEVELS[currentLevel - 1];

  return (
    <div className="game-container">
      <div className="canvas-container">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={50} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.1}
          />

          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 15, 10]} intensity={0.8} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.4} color="#00f0ff" />
          <spotLight
            position={[0, 20, 0]}
            angle={0.5}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          {/* Background */}
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <fog attach="fog" args={['#0a0a1a', 20, 50]} />

          <GameScene
            levelData={levelData}
            mirrors={mirrors}
            selectedMirror={selectedMirror}
            onMirrorSelect={handleMirrorSelect}
            onWin={handleWin}
          />
        </Canvas>
      </div>

      <GameUI
        currentLevel={currentLevel}
        totalLevels={LEVELS.length}
        completedLevels={completedLevels}
        selectedMirror={selectedMirror}
        moveCount={moveCount}
        gameTime={gameTime}
        onRotateMirror={handleMirrorRotate}
        onMoveMirror={handleMirrorMove}
        onResetLevel={handleResetLevel}
        onLevelSelect={handleLevelSelect}
      />

      {hasWon && (
        <WinOverlay
          level={currentLevel}
          moveCount={moveCount}
          gameTime={gameTime}
          onNextLevel={handleNextLevel}
          onReplay={handleResetLevel}
          hasNextLevel={currentLevel < LEVELS.length}
        />
      )}
    </div>
  );
}

export default App;
