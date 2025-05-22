import {
  Scene,
  Engine,
  ArcRotateCamera,
  Mesh,
  DynamicTexture,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { initScene } from "./init-scene";
import { IdGenerator } from "@/id-generator";
import { clearFloorTexture } from "./clear-floor-texture";
import { ActionEntityManager } from "./scene-entities/action-entity-models/action-entity-manager";
import { testTrees } from "./test-trees";

export const LAYER_MASK_1 = 0x10000000;
export const LAYER_MASK_ALL = 0xffffffff;

export class GameWorld {
  engine: Engine;
  scene: Scene;
  camera: ArcRotateCamera | null = null;
  sun: Mesh;
  idGenerator = new IdGenerator();
  groundTexture: DynamicTexture;

  actionEntityManager = new ActionEntityManager();
  updateFunctions: (() => void)[] = [];

  constructor(public canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    // this.engine.setHardwareScalingLevel(10); // renders at lower resolutions
    this.scene = new Scene(this.engine);

    [this.camera, this.sun, this.groundTexture] = this.initScene();
    this.camera.layerMask = LAYER_MASK_ALL;
    this.scene.activeCamera = this.camera;

    this.engine.runRenderLoop(() => {
      this.updateGameWorld();
      this.scene.render();
    });

    this.testModels(this.scene);
  }

  async testModels(scene: Scene) {
    testTrees(scene);
  }

  updateGameWorld() {
    for (const fn of this.updateFunctions) {
      fn();
    }

    for (const actionEntityModel of this.actionEntityManager.get()) {
      actionEntityModel.movementManager.processActiveActions();
      actionEntityModel.animationManager.playing?.animationGroup?.animateScene(
        actionEntityModel.animationManager.scene
      );
      actionEntityModel.animationManager.handleCompletedAnimations();
      actionEntityModel.animationManager.stepAnimationTransitionWeights();
    }
  }

  initScene = initScene;
  clearFloorTexture = clearFloorTexture;
}
