import { ActionManager } from 'babylonjs';
import useBabylon from '.';

export default function () {
  const { sceneRef } = useBabylon();
  const BuildActionManager = () => new ActionManager(sceneRef.value!);
  return { BuildActionManager };
}
