import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Emitter({ position, direction, color }) {
    const glowRef = useRef();
    const beamStartRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (glowRef.current) {
            glowRef.current.material.emissiveIntensity = 1 + Math.sin(t * 6) * 0.3;
        }

        if (beamStartRef.current) {
            beamStartRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.1);
        }
    });

    // Calculate rotation to point in direction
    const dir = new THREE.Vector3(...direction).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    return (
        <group position={position}>
            {/* Main emitter body */}
            <mesh rotation={euler} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Emitter lens/front */}
            <mesh position={[dir.x * 0.4, dir.y * 0.4, dir.z * 0.4]} rotation={euler}>
                <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1}
                    metalness={0.3}
                    roughness={0.1}
                />
            </mesh>

            {/* Glow effect */}
            <mesh
                ref={glowRef}
                position={[dir.x * 0.5, dir.y * 0.5, dir.z * 0.5]}
            >
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Beam start point */}
            <mesh
                ref={beamStartRef}
                position={[dir.x * 0.6, dir.y * 0.6, dir.z * 0.6]}
            >
                <sphereGeometry args={[0.15, 12, 12]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Base/stand */}
            <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.4, 12]} />
                <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Base plate */}
            <mesh position={[0, -0.85, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                <meshStandardMaterial color="#1a202c" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Decorative rings */}
            <mesh rotation={euler} position={[0, 0, 0]}>
                <torusGeometry args={[0.35, 0.03, 8, 24]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>

            {/* Point light for glow effect */}
            <pointLight
                position={[dir.x * 0.5, dir.y * 0.5, dir.z * 0.5]}
                color={color}
                intensity={2}
                distance={5}
            />
        </group>
    );
}

export default Emitter;
