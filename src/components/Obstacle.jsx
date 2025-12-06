import React from 'react';

function Obstacle({ position, size }) {
    return (
        <group position={position}>
            {/* Main obstacle body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial
                    color="#2d1f3d"
                    metalness={0.4}
                    roughness={0.6}
                />
            </mesh>

            {/* Top edge glow */}
            <mesh position={[0, size[1] / 2, 0]}>
                <boxGeometry args={[size[0] + 0.05, 0.05, size[2] + 0.05]} />
                <meshStandardMaterial
                    color="#ff0066"
                    emissive="#ff0066"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Bottom edge glow */}
            <mesh position={[0, -size[1] / 2, 0]}>
                <boxGeometry args={[size[0] + 0.05, 0.05, size[2] + 0.05]} />
                <meshStandardMaterial
                    color="#ff0066"
                    emissive="#ff0066"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Warning stripes texture simulation */}
            {[0.3, 0, -0.3].map((yOffset, i) => (
                <mesh key={i} position={[size[0] / 2 + 0.01, yOffset, 0]}>
                    <planeGeometry args={[0.02, 0.2]} />
                    <meshStandardMaterial
                        color="#ffaa00"
                        emissive="#ffaa00"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default Obstacle;
