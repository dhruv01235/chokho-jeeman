'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function FoodMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <meshStandardMaterial
        color="#d97706"
        metalness={0.8}
        roughness={0.2}
        emissive="#92400e"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export default function FoodCard3D() {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-amber-900/40">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#fbbf24" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#dc2626" />
        <FoodMesh />
      </Canvas>
    </div>
  );
}
