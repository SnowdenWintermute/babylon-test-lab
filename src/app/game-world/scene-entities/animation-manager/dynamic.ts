import { AssetContainer, Vector3 } from "@babylonjs/core";
import {
  AnimationManager,
  DYNAMIC_ANIMATION_NAME_STRINGS,
  DynamicAnimationName,
  ManagedAnimation,
  ManagedAnimationOptions,
  MISSING_ANIMATION_DEFAULT_ACTION_FALLBACK_TIME,
} from ".";
import cloneDeep from "lodash.clonedeep";
import { Milliseconds } from "@/app/named-types";
import { DYNAMIC_ANIMATION_CREATORS } from "./dynamic-animation-creators";

export abstract class DynamicAnimation {
  protected timeStarted = Date.now();
  public abstract name: string;
  protected abstract duration: number;
  constructor(public despawnOnComplete: boolean) {}

  getLength() {
    return this.duration;
  }

  setDuration(ms: Milliseconds) {
    this.duration = ms;
  }

  clone() {
    return cloneDeep(this);
  }

  start(shouldLoop: boolean, speedModifier?: number) {}

  abstract animateScene(scene: AssetContainer): void;
}

export class ManagedDynamicAnimation extends ManagedAnimation<DynamicAnimation> {
  timeStarted: number = Date.now();
  weight: number = 0;
  constructor(
    public animationGroup: DynamicAnimation,
    public transitionDuration: number = 0,
    public options: ManagedAnimationOptions
  ) {
    super(animationGroup, transitionDuration, options);
  }

  setWeight(newWeight: number) {}

  isCompleted() {
    if (this.options.shouldLoop) return false;
    const timeSinceStarted = Date.now() - this.timeStarted;

    if (!this.animationGroup)
      return timeSinceStarted >= MISSING_ANIMATION_DEFAULT_ACTION_FALLBACK_TIME;

    return timeSinceStarted >= Math.floor(this.animationGroup.getLength());
  }
}

export class DynamicAnimationManager
  implements AnimationManager<DynamicAnimation>
{
  playing: null | ManagedDynamicAnimation = null;
  previous: null | ManagedDynamicAnimation = null;
  locked: boolean = false;
  constructor(public scene: AssetContainer) {
    // stop default animation
  }
  cloneAnimation(animationGroup: DynamicAnimation): DynamicAnimation {
    return animationGroup.clone();
  }

  startAnimationWithTransition(
    newAnimationName: DynamicAnimationName,
    transitionDuration: number,
    options: ManagedAnimationOptions = {
      shouldLoop: true,
      onComplete: () => {},
    }
  ): Error | void {
    if (this.playing !== null) {
      if (this.previous !== null) this.cleanUpFinishedAnimation(this.previous);
      this.previous = this.playing;
      this.playing = null;
    }

    const newAnimationGroup = this.getAnimationGroupByName(newAnimationName);

    if (options.animationDurationOverrideOption)
      newAnimationGroup.setDuration(options.animationDurationOverrideOption);

    const clonedAnimationOption = this.cloneAnimation(newAnimationGroup);

    this.playing = new ManagedDynamicAnimation(
      clonedAnimationOption,
      transitionDuration,
      options
    );

    if (clonedAnimationOption) {
      if (options.animationDurationOverrideOption) {
        const animationStockDuration = clonedAnimationOption.getLength();
        const speedModifier =
          animationStockDuration /
          (options.animationDurationOverrideOption ?? 1);

        clonedAnimationOption.start(!!options.shouldLoop, speedModifier);
      } else clonedAnimationOption.start(!!options.shouldLoop);
    }
  }

  stepAnimationTransitionWeights(): Error | void {
    // if (!this.playing) console.log("no animation played this frame");
    if (!this.playing || this.playing.weight >= 1) return;

    const timeSinceStarted = Date.now() - this.playing.timeStarted;
    let percentTransitionCompleted =
      timeSinceStarted / this.playing.transitionDuration;
    percentTransitionCompleted = Math.min(1, percentTransitionCompleted);

    this.playing.setWeight(percentTransitionCompleted);
    if (this.previous) this.previous.setWeight(1 - this.playing.weight);
  }

  cleanUpFinishedAnimation(managedAnimation: ManagedDynamicAnimation) {
    const { onComplete } = managedAnimation.options;
    if (onComplete) onComplete();
    if (managedAnimation.animationGroup.despawnOnComplete) this.scene.dispose();
  }

  handleCompletedAnimations() {
    if (this.previous?.weight === 0) {
      this.cleanUpFinishedAnimation(this.previous);
      this.previous = null;
    }

    if (this.playing && this.playing.isCompleted()) {
      this.cleanUpFinishedAnimation(this.playing);
      this.playing = null;
    }
  }

  getAnimationGroupByName(animationName: DynamicAnimationName) {
    return DYNAMIC_ANIMATION_CREATORS[animationName](this.scene);
  }

  getFallbackAnimationName(animationName: DynamicAnimationName) {
    return undefined;
  }
}

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
