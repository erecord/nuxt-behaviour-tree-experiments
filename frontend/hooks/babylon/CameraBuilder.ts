import { ref } from '@nuxtjs/composition-api';
import { Vector3, ArcRotateCamera, Camera } from 'babylonjs';
import useBabylon from '.';

const camerasRef = ref<Camera[]>([]);

export default function () {
  const { sceneRef, canvasRef } = useBabylon();

  const BuildArcRotateCamera = (
    alpha: number,
    beta: number,
    radius: number,
    position: Vector3,
    target: Vector3 = new Vector3(0, 0, 0)
  ) => {
    const camerasRefLength = camerasRef.value.length;
    const camera: ArcRotateCamera = new ArcRotateCamera(
      `camera${camerasRefLength + 1}`,
      alpha,
      beta,
      radius,
      target,
      sceneRef.value!
    );
    camera.position = position;
    camera.attachControl(canvasRef.value, true);
  };

  return { BuildArcRotateCamera };
}
