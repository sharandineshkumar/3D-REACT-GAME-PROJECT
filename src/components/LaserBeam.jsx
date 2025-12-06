import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Helper function to reflect a vector off a surface normal
function reflectVector(incident, normal) {
    const dot = incident.dot(normal);
    return incident.clone().sub(normal.clone().multiplyScalar(2 * dot)).normalize();
}

// Check if ray intersects with a plane (mirror)
function rayPlaneIntersection(rayOrigin, rayDirection, planePoint, planeNormal) {
    const denom = rayDirection.dot(planeNormal);
    if (Math.abs(denom) < 0.0001) return null;

    const t = planePoint.clone().sub(rayOrigin).dot(planeNormal) / denom;
    if (t < 0.01) return null;

    return rayOrigin.clone().add(rayDirection.clone().multiplyScalar(t));
}

// Check if point is within mirror bounds
function isPointOnMirror(point, mirrorPosition, mirrorRotation, mirrorSize) {
    const mirrorMatrix = new THREE.Matrix4();
    const euler = new THREE.Euler(mirrorRotation[0], mirrorRotation[1], mirrorRotation[2]);
    mirrorMatrix.makeRotationFromEuler(euler);

    const inverseMatrix = mirrorMatrix.clone().invert();
    const localPoint = point.clone().sub(new THREE.Vector3(...mirrorPosition));
    localPoint.applyMatrix4(inverseMatrix);

    const halfWidth = mirrorSize[0] / 2;
    const halfHeight = mirrorSize[1] / 2;

    return Math.abs(localPoint.x) <= halfWidth && Math.abs(localPoint.y) <= halfHeight;
}

// Check if ray hits an obstacle
function rayBoxIntersection(rayOrigin, rayDirection, boxPosition, boxSize) {
    const min = new THREE.Vector3(
        boxPosition[0] - boxSize[0] / 2,
        boxPosition[1] - boxSize[1] / 2,
        boxPosition[2] - boxSize[2] / 2
    );
    const max = new THREE.Vector3(
        boxPosition[0] + boxSize[0] / 2,
        boxPosition[1] + boxSize[1] / 2,
        boxPosition[2] + boxSize[2] / 2
    );

    let tmin = (min.x - rayOrigin.x) / rayDirection.x;
    let tmax = (max.x - rayOrigin.x) / rayDirection.x;

    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

    let tymin = (min.y - rayOrigin.y) / rayDirection.y;
    let tymax = (max.y - rayOrigin.y) / rayDirection.y;

    if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

    if ((tmin > tymax) || (tymin > tmax)) return null;

    if (tymin > tmin) tmin = tymin;
    if (tymax < tmax) tmax = tymax;

    let tzmin = (min.z - rayOrigin.z) / rayDirection.z;
    let tzmax = (max.z - rayOrigin.z) / rayDirection.z;

    if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

    if ((tmin > tzmax) || (tzmin > tmax)) return null;

    if (tzmin > tmin) tmin = tzmin;

    if (tmin < 0.01) return null;

    return tmin;
}

function LaserBeam({
    emitterPosition,
    emitterDirection,
    mirrors,
    obstacles,
    receiverPosition,
    receiverSize,
    color,
    onHitReceiver
}) {
    const lineRef = useRef();
    const glowRef = useRef();
    const [hitReceiver, setHitReceiver] = useState(false);

    const beamPoints = useMemo(() => {
        const points = [];
        const maxReflections = 20;
        const maxDistance = 50;

        let currentPos = new THREE.Vector3(...emitterPosition);
        let currentDir = new THREE.Vector3(...emitterDirection).normalize();

        points.push(currentPos.clone());

        for (let i = 0; i < maxReflections; i++) {
            let closestHit = null;
            let closestDistance = maxDistance;
            let hitMirror = null;

            // Check each mirror for intersection
            for (const mirror of mirrors) {
                const mirrorPos = new THREE.Vector3(...mirror.position);
                const euler = new THREE.Euler(mirror.rotation[0], mirror.rotation[1], mirror.rotation[2]);

                // Get mirror normal (facing +Z in local space, transformed to world)
                const mirrorNormal = new THREE.Vector3(0, 0, 1);
                mirrorNormal.applyEuler(euler);

                const intersection = rayPlaneIntersection(currentPos, currentDir, mirrorPos, mirrorNormal);

                if (intersection && isPointOnMirror(intersection, mirror.position, mirror.rotation, mirror.size)) {
                    const distance = currentPos.distanceTo(intersection);
                    if (distance < closestDistance && distance > 0.01) {
                        closestDistance = distance;
                        closestHit = intersection;
                        hitMirror = { position: mirror.position, rotation: mirror.rotation, normal: mirrorNormal };
                    }
                }
            }

            // Check obstacles
            let hitObstacle = false;
            for (const obstacle of obstacles) {
                const obstacleHit = rayBoxIntersection(currentPos, currentDir, obstacle.position, obstacle.size);
                if (obstacleHit && obstacleHit < closestDistance) {
                    closestDistance = obstacleHit;
                    closestHit = currentPos.clone().add(currentDir.clone().multiplyScalar(obstacleHit));
                    hitObstacle = true;
                    hitMirror = null;
                }
            }

            // Check receiver
            const receiverPos = new THREE.Vector3(...receiverPosition);
            const toReceiver = receiverPos.clone().sub(currentPos);
            const projLength = toReceiver.dot(currentDir);

            if (projLength > 0) {
                const closestPoint = currentPos.clone().add(currentDir.clone().multiplyScalar(projLength));
                const distToReceiver = closestPoint.distanceTo(receiverPos);

                if (distToReceiver < receiverSize && projLength < closestDistance) {
                    points.push(receiverPos.clone());
                    return { points, hitReceiver: true };
                }
            }

            if (closestHit && hitMirror) {
                points.push(closestHit.clone());
                currentPos = closestHit.clone();
                currentDir = reflectVector(currentDir, hitMirror.normal);
            } else if (closestHit && hitObstacle) {
                points.push(closestHit.clone());
                return { points, hitReceiver: false };
            } else {
                // No hit, extend to max distance
                const endPoint = currentPos.clone().add(currentDir.clone().multiplyScalar(maxDistance));
                points.push(endPoint);
                break;
            }
        }

        return { points, hitReceiver: false };
    }, [emitterPosition, emitterDirection, mirrors, obstacles, receiverPosition, receiverSize]);

    useEffect(() => {
        if (beamPoints.hitReceiver && !hitReceiver) {
            setHitReceiver(true);
            onHitReceiver();
        } else if (!beamPoints.hitReceiver && hitReceiver) {
            setHitReceiver(false);
        }
    }, [beamPoints.hitReceiver, hitReceiver, onHitReceiver]);

    // Animate glow
    useFrame((state) => {
        if (glowRef.current) {
            const t = state.clock.elapsedTime;
            glowRef.current.material.opacity = 0.3 + Math.sin(t * 5) * 0.1;
        }
    });

    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(beamPoints.points);
        return geometry;
    }, [beamPoints.points]);

    return (
        <group>
            {/* Main laser line */}
            <line ref={lineRef} geometry={lineGeometry}>
                <lineBasicMaterial
                    color={color}
                    linewidth={3}
                    transparent
                    opacity={1}
                />
            </line>

            {/* Glow effect - tube along the path */}
            {beamPoints.points.length >= 2 && beamPoints.points.map((point, index) => {
                if (index === beamPoints.points.length - 1) return null;
                const nextPoint = beamPoints.points[index + 1];
                const midPoint = point.clone().add(nextPoint).multiplyScalar(0.5);
                const direction = nextPoint.clone().sub(point);
                const length = direction.length();
                direction.normalize();

                // Calculate rotation to align cylinder with direction
                const quaternion = new THREE.Quaternion();
                quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
                const euler = new THREE.Euler().setFromQuaternion(quaternion);

                return (
                    <mesh
                        key={index}
                        position={midPoint}
                        rotation={euler}
                        ref={index === 0 ? glowRef : null}
                    >
                        <cylinderGeometry args={[0.05, 0.05, length, 8]} />
                        <meshBasicMaterial
                            color={color}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                );
            })}

            {/* Glow spheres at reflection points */}
            {beamPoints.points.map((point, index) => {
                if (index === 0 || index === beamPoints.points.length - 1) return null;
                return (
                    <mesh key={`glow-${index}`} position={point}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshBasicMaterial color={color} transparent opacity={0.9} />
                    </mesh>
                );
            })}
        </group>
    );
}

export default LaserBeam;
