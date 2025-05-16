import { AssetContainer } from "@babylonjs/core";
import { DynamicAnimation, RotateAroundPoint } from "./dynamic";
import { DynamicAnimationName } from ".";

export const DYNAMIC_ANIMATION_CREATORS: Record<
  DynamicAnimationName,
  (scene: AssetContainer) => DynamicAnimation
> = {
  [DynamicAnimationName.RotateAroundPoint]: function (scene: AssetContainer) {
    return new RotateAroundPoint(scene);
  },
};
