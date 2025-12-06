import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Mirror({ id, position, rotation, size, isSelected, onClick }) {
    const meshRef = useRef();
    const frameRef = useRef();
    const glowRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Animate selection glow
    useFrame((state) => {
        if (glowRef.current) {
            const t = state.clock.elapsedTime;
            if (isSelected) {
                glowRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.3;
            } else if (hovered) {
                glowRef.current.material.emissiveIntensity = 0.3;
            } else {
                glowRef.current.material.emissiveIntensity = 0.1;
            }
        }

        // Subtle floating animation when selected
        if (meshRef.current && isSelected) {
            const t = state.clock.elapsedTime;
            meshRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
        } else if (meshRef.current) {
            meshRef.current.position.y = position[1];
        }
    });

    const frameColor = isSelected ? '#00ff88' : hovered ? '#00f0ff' : '#4a5568';
    const glowColor = isSelected ? '#00ff88' : '#00f0ff';

    return (
        <group
            ref={meshRef}
            position={position}
            rotation={rotation}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHovered(false);
                document.body.style.cursor = 'default';
            }}
        >
            {/* Mirror surface */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[size[0], size[1], 0.05]} />
                <meshPhysicalMaterial
                    color="#88ccff"
                    metalness={1}
                    roughness={0.05}
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    reflectivity={1}
                />
            </mesh>

            {/* Mirror back */}
            <mesh position={[0, 0, -0.03]}>
                <boxGeometry args={[size[0], size[1], 0.02]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Frame - Top */}
            <mesh ref={frameRef} position={[0, size[1] / 2 + 0.05, 0]}>
                <boxGeometry args={[size[0] + 0.2, 0.1, 0.15]} />
                <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Frame - Bottom */}
            <mesh position={[0, -size[1] / 2 - 0.05, 0]}>
                <boxGeometry args={[size[0] + 0.2, 0.1, 0.15]} />
                <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Frame - Left */}
            <mesh position={[-size[0] / 2 - 0.05, 0, 0]}>
                <boxGeometry args={[0.1, size[1], 0.15]} />
                <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Frame - Right */}
            <mesh position={[size[0] / 2 + 0.05, 0, 0]}>
                <boxGeometry args={[0.1, size[1], 0.15]} />
                <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Glow ring when selected or hovered */}
            {(isSelected || hovered) && (
                <mesh ref={glowRef} position={[0, 0, 0.1]}>
                    <ringGeometry args={[Math.max(size[0], size[1]) / 2 + 0.1, Math.max(size[0], size[1]) / 2 + 0.2, 32]} />
                    <meshStandardMaterial
                        color={glowColor}
                        emissive={glowColor}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Stand/Base */}
            <mesh position={[0, -size[1] / 2 - 0.3, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 0.4, 12]} />
                <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Base plate */}
            <mesh position={[0, -size[1] / 2 - 0.55, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
                <meshStandardMaterial color="#1a202c" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Selection indicator arrows */}
            {isSelected && (
                <>
                    {/* Rotation indicator ring */}
                    <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[size[0] / 2 + 0.3, 0.02, 8, 32]} />
                        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
                    </mesh>
                </>
            )}
        </group>
    );
}

export default Mirror;
