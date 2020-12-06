import { ref } from '@nuxtjs/composition-api';
import { StandardMaterial, Color3, Mesh, Texture } from 'babylonjs';
import useBabylon from '.';

const blue = new Color3(0.2, 0.5, 0.9);
const materialsRef = ref<StandardMaterial[]>([]);

export default function () {
  const { sceneRef } = useBabylon();

  const ApplyGroundMaterial = (mesh: Mesh) => {
    const materialsRefLength = materialsRef.value.length;
    const groundMat = new StandardMaterial(
      `material${materialsRefLength + 1}`,
      sceneRef.value!
    );
    groundMat.diffuseColor = blue;
    materialsRef.value.push(groundMat);
    mesh.material = groundMat;
  };

  const ApplyBoxMaterial = (mesh: Mesh) => {
    const materialsRefLength = materialsRef.value.length;
    const boxMaterial = new StandardMaterial(
      `mesh${materialsRefLength}`,
      sceneRef.value!
    );
    boxMaterial.diffuseTexture = new Texture(
      'https://doc.babylonjs.com/_next/image?url=%2Fimg%2Fgetstarted%2Fcubehouse.png&w=1080&q=75',
      sceneRef.value!
    );
    mesh.material = boxMaterial;
    materialsRef.value.push(boxMaterial);
  };

  const ApplyRoofMaterial = (mesh: Mesh) => {
    const materialsRefLength = materialsRef.value.length;
    const roofMaterial = new StandardMaterial(
      `material${materialsRefLength + 1}`,
      sceneRef.value!
    );
    roofMaterial.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/roof.jpg',
      sceneRef.value!
    );
    mesh.material = roofMaterial;
  };
  return { ApplyGroundMaterial, ApplyRoofMaterial, ApplyBoxMaterial };
}
