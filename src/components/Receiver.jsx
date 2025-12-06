import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Receiver({ position, size }) {
    const meshRef = useRef();
    const ringRef = useRef();
    const glowRef = useRef();
    const [isHit, setIsHit] = useState(false);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Rotate the target rings
        if (ringRef.current) {
            ringRef.current.rotation.z = t * 0.5;
        }

        // Pulse the glow
        if (glowRef.current) {
            const pulseIntensity = isHit ? 2 : 0.5;
            glowRef.current.material.emissiveIntensity = pulseIntensity + Math.sin(t * 4) * 0.3;
        }

        // Subtle floating animation
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.05;
        }
    });

    const targetColor = '#00ff88';
    const innerColor = '#ffffff';

    return (
        <group ref={meshRef} position={position}>
            {/* Outer ring */}
            <mesh ref={ringRef} rotation={[0, 0, 0]}>
                <torusGeometry args={[size * 0.8, 0.08, 8, 32]} />
                <meshStandardMaterial
                    color={targetColor}
                    emissive={targetColor}
                    emissiveIntensity={0.8}
                    metalness={0.5}
                    roughness={0.2}
                />
            </mesh>

            {/* Middle ring */}
            <mesh rotation={[0, 0, Math.PI / 6]}>
                <torusGeometry args={[size * 0.5, 0.06, 8, 24]} />
                <meshStandardMaterial
                    color={targetColor}
                    emissive={targetColor}
                    emissiveIntensity={0.6}
                    metalness={0.5}
                    roughness={0.2}
                />
            </mesh>

            {/* Inner target */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[size * 0.2, 16, 16]} />
                <meshStandardMaterial
                    color={innerColor}
                    emissive={targetColor}
                    emissiveIntensity={0.5}
                    metalness={0.3}
                    roughness={0.1}
                />
            </mesh>

            {/* Target backing plate */}
            <mesh position={[0, 0, -0.1]}>
                <cylinderGeometry args={[size, size, 0.1, 32]} />
                <meshStandardMaterial
                    color="#1a202c"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Decorative elements - corner markers */}
            {[0, 1, 2, 3].map((i) => {
                const angle = (i * Math.PI) / 2;
                const x = Math.cos(angle) * size * 0.9;
                const y = Math.sin(angle) * size * 0.9;
                return (
                    <mesh key={i} position={[x, y, 0.05]}>
                        <boxGeometry args={[0.1, 0.1, 0.1]} />
                        <meshStandardMaterial
                            color={targetColor}
                            emissive={targetColor}
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                );
            })}

            {/* Stand */}
            <mesh position={[0, -size - 0.3, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 0.5, 12]} />
                <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Base */}
            <mesh position={[0, -size - 0.6, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
                <meshStandardMaterial color="#1a202c" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Point light */}
            <pointLight
                color={targetColor}
                intensity={1}
                distance={4}
            />
        </group>
    );
}

export default Receiver;
