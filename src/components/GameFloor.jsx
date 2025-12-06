import React from 'react';

function GameFloor() {
    return (
        <group>
            {/* Main floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                    color="#0a1628"
                    metalness={0.3}
                    roughness={0.8}
                />
            </mesh>

            {/* Inner platform */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial
                    color="#0d1f35"
                    metalness={0.4}
                    roughness={0.6}
                />
            </mesh>

            {/* Glowing border lines */}
            {[-10, 10].map((pos) => (
                <React.Fragment key={pos}>
                    {/* X-axis lines */}
                    <mesh position={[0, 0.02, pos]}>
                        <boxGeometry args={[20, 0.02, 0.05]} />
                        <meshStandardMaterial
                            color="#00f0ff"
                            emissive="#00f0ff"
                            emissiveIntensity={0.5}
                            transparent
                            opacity={0.7}
                        />
                    </mesh>
                    {/* Z-axis lines */}
                    <mesh position={[pos, 0.02, 0]}>
                        <boxGeometry args={[0.05, 0.02, 20]} />
                        <meshStandardMaterial
                            color="#00f0ff"
                            emissive="#00f0ff"
                            emissiveIntensity={0.5}
                            transparent
                            opacity={0.7}
                        />
                    </mesh>
                </React.Fragment>
            ))}

            {/* Corner markers */}
            {[[-10, -10], [-10, 10], [10, -10], [10, 10]].map(([x, z], i) => (
                <mesh key={i} position={[x, 0.05, z]}>
                    <boxGeometry args={[0.3, 0.1, 0.3]} />
                    <meshStandardMaterial
                        color="#00ff88"
                        emissive="#00ff88"
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}

            {/* Decorative floor patterns */}
            {[-5, 0, 5].map((x) =>
                [-5, 0, 5].map((z) => (
                    <mesh key={`${x}-${z}`} position={[x, 0.015, z]} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[0.3, 0.35, 4]} />
                        <meshStandardMaterial
                            color="#1a3a5a"
                            transparent
                            opacity={0.5}
                        />
                    </mesh>
                ))
            )}
        </group>
    );
}

export default GameFloor;
