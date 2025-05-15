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

export const LAYER_MASK_1 = 0x10000000;
export const LAYER_MASK_ALL = 0xffffffff;

export class GameWorld {
  engine: Engine;
  scene: Scene;
  camera: ArcRotateCamera | null = null;
  sun: Mesh;
  idGenerator = new IdGenerator();
  groundTexture: DynamicTexture;

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
  }

  updateGameWorld() {}

  initScene = initScene;
  clearFloorTexture = clearFloorTexture;
}
