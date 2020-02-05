import React, { useRef, useEffect } from 'react';
import { extend, useThree, useFrame } from 'react-three-fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { select } from 'd3';
const THREE = require('three');
extend({ TrackballControls });

// key code constants
const ALT_KEY = 18;
const CTRL_KEY = 17;
const CMD_KEY = 91;

export const Controls = ({ minDistance, maxDistance, defaultPosition }) => {
  const controls = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    // update the view as the vis is interacted with
    controls.current.update();
  });

  useEffect(() => {
    const view = select(gl.domElement);
    view.on('dblclick.zoom', () => {
      // reset look-at (target) and camera position
      controls.current.target.set(0, 0, 0);
      camera.position.set(...defaultPosition);

      // needed for trackball controls, reset the up vector
      camera.up.set(
        controls.current.up0.x,
        controls.current.up0.y,
        controls.current.up0.z
      );
    });
  }, [ gl, camera, defaultPosition ])

  return (
    <trackballControls
      ref={controls}
      args={[camera, gl.domElement]}
      minDistance={minDistance}
      maxDistance={maxDistance}
      dynamicDampingFactor={0.1}
      keys={[
        ALT_KEY, // orbit
        CTRL_KEY, // zoom
        CMD_KEY, // pan
      ]}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
    />
  );
};
