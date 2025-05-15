import { AssetContainer } from "@babylonjs/core";
import { DynamicAnimation } from "./dynamic";
import { DynamicAnimationName } from ".";
import { RotateAroundPoint } from "./rotate-around-point";

export const DYNAMIC_ANIMATION_CREATORS: Record<
  DynamicAnimationName,
  (scene: AssetContainer) => DynamicAnimation
> = {
  [DynamicAnimationName.RotateAroundPoint]: function (scene: AssetContainer) {
    return new RotateAroundPoint(scene);
  },
};
