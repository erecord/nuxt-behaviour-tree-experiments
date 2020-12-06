import { onMounted } from '@nuxtjs/composition-api';
import { Mesh } from 'babylonjs';
import useBabylon from '../hooks/babylon';

export default () => {
  const {
    canvasRef,
    onHTMLReady,
    useMeshBuilder,
    useLightBuilder,
    useCameraBuilder,
    useApplyMaterial,
    useDTOBuilder,
  } = useBabylon();

  const { BuildArcRotateCamera } = useCameraBuilder();
  const { BuildGround, BuildBox, BuildCylinder } = useMeshBuilder();
  const { BuildHemisphericLight } = useLightBuilder();
  const {
    ApplyGroundMaterial,
    ApplyRoofMaterial,
    ApplyBoxMaterial,
  } = useApplyMaterial();
  const { BuildVector3 } = useDTOBuilder();

  onMounted(() => {
    onHTMLReady();

    BuildArcRotateCamera(
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      BuildVector3(5, 4, 0)
    );

    BuildHemisphericLight(BuildVector3(1, 1, 0));

    const ground = BuildGround(15);
    ApplyGroundMaterial(ground);

    const house = BuildHouse();
    PopulateHousesOnGround(house);
  });

  const BuildHouse = () => {
    const box = BuildBox(BuildVector3(0, 0, 0), 1);
    ApplyBoxMaterial(box);
    const roof = BuildRoof();
    const house = Mesh.MergeMeshes(
      [box, roof],
      true,
      false,
      undefined,
      false,
      true
    ) as Mesh;
    house.position.y = 0.5;
    return house;
  };

  const BuildRoof = () => {
    const roof = BuildCylinder({ diameter: 1.3, height: 1.2, tessellation: 3 });
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 0.75;
    ApplyRoofMaterial(roof);
    return roof;
  };

  const PopulateHousesOnGround = (house: Mesh) => {
    const houseLocations = []; // each entry is an array [house type, rotation, x, z]
    houseLocations.push([1, -Math.PI / 16, -6.8, 2.5]);
    houseLocations.push([2, -Math.PI / 16, -4.5, 3]);
    houseLocations.push([2, -Math.PI / 16, -1.5, 4]);
    houseLocations.push([2, -Math.PI / 3, 1.5, 6]);
    houseLocations.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
    houseLocations.push([1, (15 * Math.PI) / 16, -4.1, -1]);
    houseLocations.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
    houseLocations.push([1, (5 * Math.PI) / 4, 0, -1]);
    houseLocations.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
    houseLocations.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
    houseLocations.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
    houseLocations.push([2, Math.PI / 1.9, 4.75, -1]);
    houseLocations.push([1, Math.PI / 1.95, 4.5, -3]);
    houseLocations.push([2, Math.PI / 1.9, 4.75, -5]);
    houseLocations.push([1, Math.PI / 1.9, 4.75, -7]);
    houseLocations.push([2, -Math.PI / 3, 5.25, 2]);
    houseLocations.push([1, -Math.PI / 3, 6, 4]);

    if (house) {
      const houses = [];
      for (let i = 0; i < houseLocations.length; i++) {
        houses[i] = house.createInstance('house' + i);
        houses[i].rotation.y = houseLocations[i][1];
        houses[i].position.x = houseLocations[i][2];
        houses[i].position.z = houseLocations[i][3];
      }
    }
  };

  return { canvasRef };
};
