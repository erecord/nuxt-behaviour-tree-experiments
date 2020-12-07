import { TransformNode } from 'babylonjs';
import useBabylon from '.';

export default function () {
  const { sceneRef } = useBabylon();

  const ApplySineWave = (node: TransformNode, incrementValue: number) => {
    let y = 0;
    sceneRef.value!.registerBeforeRender(() => {
      node.position.y = Math.sin(y) * 5 + 6;
      y += incrementValue;
    });
  };

  const ApplyCosineWave = (node: TransformNode, incrementValue: number) => {
    let y = 0;
    sceneRef.value!.registerBeforeRender(() => {
      node.position.y = Math.cos(y) * 5 + 6;
      y += incrementValue;
    });
  };

  const ApplyTanWave = (node: TransformNode, incrementValue: number) => {
    let y = 0;
    sceneRef.value!.registerBeforeRender(() => {
      node.position.y = Math.tan(y) * 5 + 6;
      y += incrementValue;
    });
  };

  return { ApplySineWave, ApplyCosineWave, ApplyTanWave };
}
