import React, { useRef, useEffect, useMemo } from 'react';
import { useThree } from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import { useMousePointInteraction } from './useMousePointInteraction';
import { HoverDialog } from './HoverDialog';
const THREE = require('three');

// settings
const backgroundColor = new THREE.Color('black');
const selectedPointSize = 2;

// re-use for instance computations
const scratchObject3D = new THREE.Object3D();

const updateInstancedMeshMatrices = ({
  sphereSize, aspect, mesh, points, colors, colorAttrib, colorArray, selectedPoint
}) => {
  if (!mesh) return;
  const { show, index } = selectedPoint;
  const selectedSize = show ? sphereSize*selectedPointSize : sphereSize;

  [...Array(points.length/3)].fill(0).forEach((d,i) => {
    const [ x, y, z ] = points.slice(i*3,(i+1)*3);
    // scratchObject3D.position.set(x*aspect, y, z);
    scratchObject3D.position.set(x, y, z);
    scratchObject3D.scale.setScalar(i === index ? selectedSize : sphereSize);
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  });

  colors.forEach((d,i) => colorArray[i] = d);
  colorAttrib.needsUpdate = true;
  mesh.instanceMatrix.needsUpdate = true;
};

const useAnimatedLayout = ({ points, colors, speed, onFrame }) => {
  const animProps = useSpring({
    points: points,
    colors: colors,
    onFrame: ({ points, colors }) => {
      onFrame({ points, colors});
    },
    config: { duration: speed }
  });

  return animProps;
};

export const InstancedPoints = ({
  data, sphereSize, nPoints, speed, selectedPoint, setSelectedPoint
}) => {
  const meshRef = useRef();
  const colorRef = useRef();
  const { scene, aspect } = useThree();
  const { points, colors, pointsData } = data;
  const colorArray = useMemo(() => new Float32Array(nPoints*3), [ nPoints ]);
  const { show, index } = selectedPoint;

  useEffect(() => {
    if ( scene )
      scene.background = backgroundColor;
  }, [ scene ]);

  // Animating on change
  const { points: pointsAnim } = useAnimatedLayout({
    points,
    colors,
    speed,
    onFrame: ({ points, colors }) => {
      updateInstancedMeshMatrices({
        sphereSize,
        aspect,
        mesh: meshRef.current,
        points,
        colors,
        colorAttrib: colorRef.current,
        colorArray,
        selectedPoint,
      });
    },
  });

  const { handleClick, handlePointerDown } = useMousePointInteraction({
    selectedPoint,
    onSelectPoint: setSelectedPoint
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[null, null, nPoints]}
        frustumCulled={false}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
      >
        <sphereBufferGeometry attach='geometry' args={[0.5, 8, 16]} >
          <instancedBufferAttribute
            ref={colorRef}
            attachObject={['attributes', 'color']}
            args={[colorArray, 3]}
          />
        </sphereBufferGeometry>
        <meshStandardMaterial
          attach='material'
          vertexColors={THREE.VertexColors}
        />
      </instancedMesh>
      { show && (
        <a.group
          position={ pointsAnim.interpolate((...d) => d.slice(index*3, (index+1)*3)) }
        >
          <pointLight
            distance={9}
            position={[0, 0, 1.3]}
            intensity={2.2}
            decay={30}
            color="#ffffff"
          />
          <pointLight
            position={[0, 0, 0]}
            decay={1}
            distance={10}
            intensity={5}
            color="#ffffff"
          />
        </a.group>
      )}
      <HoverDialog {...{pointsAnim, selectedPoint, pointsData}} />
    </>
  );
};
