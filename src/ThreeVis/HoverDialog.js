import React, { useRef, useMemo } from 'react';
import { Dom, useThree } from 'react-three-fiber';
import { getCanvasPosition } from './utils';
const THREE = require('three');

const margin = 10;

export const HoverDialog = ({ pointsAnim, selectedPoint, pointsData }) => {
  const hoverRef = useRef();
  const { show, index } = selectedPoint;
  const { size, camera } = useThree();
  const position = useMemo(() => {
    const clientPosition = new THREE.Vector3(size.width, 200, 0)
    console.log(clientPosition);
    const a = getCanvasPosition(clientPosition, size, camera);
    console.log(a);
    return a;
  }, [ size, camera ]);
  console.log(position);

  return (
    <Dom
      position={[5, 0, 0]}
      style={{
        display: show ? 'block' : 'none'
      }}
      ref={hoverRef}
    >
      <div className='hover-description'>
        { pointsData[index] }
      </div>
    </Dom>
  );
};