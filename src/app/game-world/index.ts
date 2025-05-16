import {
  Scene,
  Engine,
  ArcRotateCamera,
  Mesh,
  DynamicTexture,
  Vector3,
  Matrix,
  TransformNode,
  Quaternion,
  MeshBuilder,
  Space,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { initScene } from "./init-scene";
import { IdGenerator } from "@/id-generator";
import { clearFloorTexture } from "./clear-floor-texture";
import { ActionEntityManager } from "./scene-entities/action-entity-models/action-entity-manager";
import { spawnActionEntityModel } from "./scene-entities/action-entity-models/spawn-action-entity-model";
import { ActionEntityModel } from "./scene-entities/action-entity-models";
import { createDebugLines } from "./create-debug-lines";
import { pointTransformNodeToward } from "./point-transform-node-toward";
import { getPointOnArc } from "./utils";

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

    this.testModels();
  }

  async testModels() {
    const box = MeshBuilder.CreateBox("", { size: 0.03 });

    const arrowModel = await spawnActionEntityModel(
      "/3d-assets/equipment/arrow.glb",
      Vector3.Zero(),
      this.scene
    );

    const transformNode = new TransformNode("");
    const rootMesh = arrowModel.meshes[0];
    if (!rootMesh) return;

    rootMesh.setParent(transformNode);
    rootMesh.setPositionWithLocalVector(Vector3.Zero());

    transformNode.position = new Vector3(2, 2, 0);

    createDebugLines(transformNode);

    const movementNode = new TransformNode("");

    movementNode.position = new Vector3(2, 2, 0);

    createDebugLines(movementNode);

    transformNode.setParent(movementNode);
    transformNode.setPositionWithLocalVector(Vector3.Zero());
    transformNode.rotationQuaternion = new Quaternion();

    const targetMesh = MeshBuilder.CreateIcoSphere("", { radius: 0.03 });
    const targetTransformNode = new TransformNode("");
    targetMesh.setParent(targetTransformNode);

    this.updateFunctions = [];

    this.updateFunctions.push(() => {
      const timestamp = Date.now();
      const amountToMove = this.engine.getTimeStep() / 300;

      const angularVelocity = (2 * Math.PI) / 10000;
      const angle = timestamp * angularVelocity;
      const pointOnArc = getPointOnArc(Vector3.Zero(), 4, angle);

      const targetMeshAngularVelocity = (2 * -Math.PI) / 5000;
      const targetMeshAngle = timestamp * targetMeshAngularVelocity;
      const targetMeshPointOnArc = getPointOnArc(
        Vector3.Zero(),
        2,
        targetMeshAngle
      );
      targetTransformNode.position.x = targetMeshPointOnArc.x;
      targetTransformNode.position.z = targetMeshPointOnArc.z;

      movementNode.position.x = pointOnArc.x;
      movementNode.position.z = pointOnArc.z;

      movementNode.rotateAround(
        movementNode.position,
        movementNode.up,
        amountToMove
      );
      movementNode.computeWorldMatrix(true); // Force update
      transformNode.computeWorldMatrix(true);
      transformNode.lookAt(targetTransformNode.position, 0, 0, 0, Space.WORLD);
    });
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
