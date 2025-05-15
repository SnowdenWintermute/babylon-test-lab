import { AssetContainer, Vector3 } from "@babylonjs/core";
import { DynamicAnimation } from "./dynamic";
import { DYNAMIC_ANIMATION_NAME_STRINGS, DynamicAnimationName } from ".";

export class RotateAroundPoint extends DynamicAnimation {
  name = DYNAMIC_ANIMATION_NAME_STRINGS[DynamicAnimationName.RotateAroundPoint];
  duration = 2000;
  point: Vector3 = Vector3.Zero();

  constructor(scene: AssetContainer) {
    super(false);
    const parentMesh = scene.meshes[0];
  }

  animateScene(scene: AssetContainer) {
    const parentMesh = scene.meshes[0];
    if (!parentMesh)
      return console.error("expected mesh not found in dynamic animation");

    const elapsed = Date.now() - this.timeStarted;
    const percentCompleted = elapsed / this.duration;
  }
}
