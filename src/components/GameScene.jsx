import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LaserBeam from './LaserBeam';
import Mirror from './Mirror';
import Receiver from './Receiver';
import Emitter from './Emitter';
import GameFloor from './GameFloor';
import Obstacle from './Obstacle';

function GameScene({ levelData, mirrors, selectedMirror, onMirrorSelect, onWin }) {
    const groupRef = useRef();

    if (!levelData) {
        return null;
    }

    return (
        <group ref={groupRef}>
            {/* Floor */}
            <GameFloor />

            {/* Grid Helper */}
            <gridHelper args={[20, 20, '#1a3a4a', '#0a1a2a']} position={[0, 0.01, 0]} />

            {/* Emitter */}
            <Emitter
                position={levelData.emitter.position}
                direction={levelData.emitter.direction}
                color={levelData.emitter.color}
            />

            {/* Receiver/Target */}
            <Receiver
                position={levelData.receiver.position}
                size={levelData.receiver.size}
            />

            {/* Mirrors */}
            {mirrors.map((mirror) => (
                <Mirror
                    key={mirror.id}
                    id={mirror.id}
                    position={mirror.position}
                    rotation={mirror.rotation}
                    size={mirror.size}
                    isSelected={selectedMirror === mirror.id}
                    onClick={() => onMirrorSelect(mirror.id)}
                />
            ))}

            {/* Obstacles */}
            {levelData.obstacles && levelData.obstacles.map((obstacle, index) => (
                <Obstacle
                    key={index}
                    position={obstacle.position}
                    size={obstacle.size}
                />
            ))}

            {/* Laser Beam */}
            <LaserBeam
                emitterPosition={levelData.emitter.position}
                emitterDirection={levelData.emitter.direction}
                mirrors={mirrors}
                obstacles={levelData.obstacles || []}
                receiverPosition={levelData.receiver.position}
                receiverSize={levelData.receiver.size}
                color={levelData.emitter.color}
                onHitReceiver={onWin}
            />
        </group>
    );
}

export default GameScene;
