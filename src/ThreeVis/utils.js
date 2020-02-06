const THREE = require('three');

export const getClientPosition = (point, size, camera) => {
  const clientPosition = new THREE.Vector3(...point);
  clientPosition.project(camera).addScalar(1).divideScalar(2);
  clientPosition.x *= size.width;
  clientPosition.y *= size.height;
  return clientPosition;
};

export const getCanvasPosition = (clientPosition, size, camera) => {
  clientPosition.x /= size.width;
  clientPosition.y /= size.height;
  clientPosition.multiplyScalar(2).subScalar(1).unproject(camera);
  return [clientPosition.x, clientPosition.y, 0];
};

export const combinations = (value, size, includeNegative=false) => {
  let out = []
  Array(size).fill(0).forEach((_v,i) => {
    const t = Array(size).fill(0);
    t[i] = value;
    out.push(t.slice())
    if ( includeNegative ) {
      t[i] = -value;
      out.push(t)
    }
  });
  return out;
};