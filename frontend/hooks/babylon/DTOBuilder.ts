import { Vector3 } from 'babylonjs';
export default function () {
  const BuildVector3 = (x, y, z) => new Vector3(x, y, x);
  return { BuildVector3 };
}
