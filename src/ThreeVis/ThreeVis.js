import React from 'react';
import { Canvas } from 'react-three-fiber';
import { InstancedPoints } from './InstancedPoints';
import { Controls } from './Controls';
import Effects from './Effects';

// camera settings
const fov = 30;
const near = 5;
const far = 300;
const defaultPosition = [0, 0, 150];
const grid = { size: 80, divisions: 10 };

export const ThreeVis = ({ data, sphereSize, nPoints, speed, selectedPoint, setSelectedPoint }) => {
  return (
    <Canvas
      camera={{
        fov: fov,
        near: 0.1,
        far: 5000,
        position: defaultPosition
      }}
      onPointerMissed={() => setSelectedPoint({ show:false, index: 0})}
    >
      <Controls
        minDistance={near}
        maxDistance={far}
        defaultPosition={defaultPosition}
      />
      <ambientLight
        color='#ffffff'
        intensity={0.15}
      />
      <hemisphereLight
        color='#ffffff'
        skyColor='#ffffff'
        groundColor='#000000'
        intensity={0.7}
      />
      <InstancedPoints
        {...{data, sphereSize, nPoints, speed, selectedPoint, setSelectedPoint}}
      />
      <gridHelper
        args={[grid.size, grid.divisions]}
        position={[0,-30,0]}
        rotation={[0,0,0]}
      />
      <Effects />
    </Canvas>
  );
};