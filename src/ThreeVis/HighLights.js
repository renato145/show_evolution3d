import React, { useState, useMemo } from 'react';
import { useFrame } from 'react-three-fiber';
import { a } from 'react-spring/three';
import { combinations } from './utils';

export const HighLight = ({ position, deltas, distance, intensity, decay, color }) => {
  const [ x, y, z ] = position.map((d,i) => d+deltas[i]);
  return (
      <pointLight
        distance={distance}
        position={[x,y,z]}
        intensity={intensity}
        decay={decay}
        color={color}
      />
  );
  // const [ lightRef, lightObject ] = useResource();
  // return (
  //   <>
  //     <pointLight
  //       ref={lightRef}
  //       distance={distance}
  //       position={[x,y,z]}
  //       intensity={intensity}
  //       decay={decay}
  //       color={color}
  //     />
  //     { lightObject && <pointLightHelper args={[ lightObject, 3 ]} /> }
  //   </>
  // );
}

export const HighLights = ({
  animPosition,
  lightConfig: { margin, distance, intensity, decay, color }
}) => {

  const [ position, setPosition ] = useState([0,0,0]);
  const deltas = useMemo(() => combinations(margin, 3, true), [ margin ]);
  useFrame(() => {
    setPosition(animPosition.getValue());
  });

  return deltas.map((d,i) => (
    <HighLight
      key={i}
      position={position}
      deltas={d}
      distance={distance}
      intensity={intensity}
      decay={decay}
      color={color}
    />
  ));

  // return (
  //   <>
  //     <pointLight
  //       ref={lightRef}
  //       distance={10}
  //       // position={[0, sphereSize/10, 0]}
  //       // position={[0, 0, 0]}
  //       position={position}
  //       intensity={5}
  //       decay={1}
  //       color="#ffffff"
  //     />
  //     { lightObject && <pointLightHelper args={[ lightObject, 5 ]} /> }
  //   </>
  // );

        // <a.group
        //   // position={ pointsAnim.interpolate((...d) => d.slice(index*3, (index+1)*3)) }
        //   // position={data.points.slice(index*3, (index+1)*3)}
        //   // position={[0,25,0]}
        // >
        //   <HighLights
        //   />
        //   <pointLight
        //     ref={lightRef}
        //     distance={10}
        //     // position={[0, sphereSize/10, 0]}
        //     // position={[0, 0, 0]}
        //     position={data.points.slice(index*3, (index+1)*3)}
        //     intensity={5}
        //     decay={1}
        //     color="#ffffff"
        //   />
        //   { lightObject && <pointLightHelper args={[ lightObject, 5 ]} /> }
        //   {/* {combinations(sphereSize*8, 3, true).map((d,i) => 
        //     <pointLight
        //       key={i}
        //       distance={85}
        //       position={d}
        //       intensity={5}
        //       decay={15}
        //       color="#ffffff"
        //     />
        //   )} */}
        // </a.group>
};
