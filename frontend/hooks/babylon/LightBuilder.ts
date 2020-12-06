import { ref } from '@nuxtjs/composition-api';
import { HemisphericLight, Vector3, Light } from 'babylonjs';
import useBabylon from '.';

const lightsRef = ref<Light[]>([]);

export default function () {
  const { sceneRef } = useBabylon();

  const BuildHemisphericLight = (direction: Vector3) => {
    const lightsRefLength = lightsRef.value.length;
    const light = new HemisphericLight(
      `light${lightsRefLength + 1}`,
      direction,
      sceneRef.value!
    );
    lightsRef.value.push(light);
    return light;
  };

  return { BuildHemisphericLight };
}
