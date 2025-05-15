import {
  AbstractMesh,
  AssetContainer,
  Quaternion,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { AnimationManager } from "./animation-manager";
import { ModelMovementManager } from "./movement-manager";
import { EntityId } from "@/id-generator";

export abstract class SceneEntity<T, U extends AnimationManager<T>> {
  public animationManager: U;
  public movementManager: ModelMovementManager;
  public rootMesh: AbstractMesh;
  public rootTransformNode: TransformNode;

  public visibility: number = 0;

  constructor(
    public entityId: EntityId,
    public assetContainer: AssetContainer,
    startPosition: Vector3,
    startRotation: Quaternion
  ) {
    this.rootTransformNode = new TransformNode(
      `${this.entityId}-root-transform-node`
    );
    this.rootTransformNode.position = startPosition;
    this.movementManager = new ModelMovementManager(this.rootTransformNode);

    const rootMesh = this.initRootMesh(assetContainer);
    this.rootMesh = rootMesh;
    this.rootMesh.setParent(this.rootTransformNode);
    this.rootMesh.position.copyFrom(Vector3.Zero());

    this.rootTransformNode.rotationQuaternion = startRotation;

    this.animationManager = this.initAnimationManager(this.assetContainer);
  }

  abstract initRootMesh(assetContainer: AssetContainer): AbstractMesh;
  abstract initAnimationManager(assetContainer: AssetContainer): U;
  abstract customCleanup(): void;

  cleanup(options: { softCleanup: boolean }) {
    if (options.softCleanup) this.softCleanup();
    else this.dispose();
  }

  private softCleanup() {
    this.assetContainer.dispose();
  }

  private dispose() {
    this.customCleanup();
    this.assetContainer.dispose();
    this.rootTransformNode.dispose(false);
  }
}
