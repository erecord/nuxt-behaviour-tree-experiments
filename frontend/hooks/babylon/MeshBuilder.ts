import { ref } from '@nuxtjs/composition-api';
import { MeshBuilder, Vector4, Vector3, Mesh, TransformNode } from 'babylonjs';
import useBabylon from '.';

const faceUV: Vector4[] = [];
faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); // rear face
faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); // front face
faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); // right side
faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); // left side

interface ICylinderOptions {
  height?: number;
  diameterTop?: number;
  diameterBottom?: number;
  diameter?: number;
  tessellation?: number;
  subdivisions?: number;
  arc?: number;
  faceColors?: Color4[];
  faceUV?: Vector4[];
  updatable?: boolean;
  hasRings?: boolean;
  enclose?: boolean;
  cap?: number;
  sideOrientation?: number;
  frontUVs?: Vector4;
  backUVs?: Vector4;
}

const meshesRef = ref<Mesh[]>([]);
const transformNodesRef = ref<TransformNode[]>([]);

export default function () {
  const { sceneRef } = useBabylon();

  const BuildTransformNode = (child: Mesh) => {
    const transformNodeRefLength = transformNodesRef.value.length;
    // create a Center of Transformation
    const CoT = new TransformNode(
      `transformNode${transformNodeRefLength + 1}`,
      sceneRef.value
    );
    transformNodesRef.value.push(CoT);
    child.parent = CoT; // apply to Box
    return CoT;
  };

  const BuildGround = (width: number, height: number = width) => {
    const meshesRefLength = meshesRef.value.length;
    const ground: Mesh = MeshBuilder.CreateGround(
      `mesh${meshesRefLength + 1}`,
      { width, height },
      sceneRef.value
    );
    meshesRef.value.push(ground);
    return ground;
  };

  const BuildBox = (
    position: Vector3,
    width: number,
    height: number = width
  ) => {
    const meshesRefLength = meshesRef.value.length;
    const box = MeshBuilder.CreateBox(
      `mesh${meshesRefLength + 1}`,
      { width, height, faceUV, wrap: true },
      sceneRef.value
    );
    box.position = position;
    meshesRef.value.push(box);
    return box;
  };

  const BuildCylinder = (options: ICylinderOptions) => {
    const meshesRefLength = meshesRef.value.length;
    const cylinder = MeshBuilder.CreateCylinder(
      `mesh${meshesRefLength + 1}`,
      options
    );
    meshesRef.value.push(cylinder);
    return cylinder;
  };

  return { BuildBox, BuildGround, BuildTransformNode, BuildCylinder };
}
