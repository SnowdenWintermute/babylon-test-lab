import {
  AssetContainer,
  Vector3,
  Quaternion,
  AbstractMesh,
} from "@babylonjs/core";
import { SceneEntity } from "..";
import { EntityId } from "@/id-generator";
import {
  DynamicAnimation,
  DynamicAnimationManager,
} from "../animation-manager/dynamic";

export class ActionEntityModel extends SceneEntity<
  DynamicAnimation,
  DynamicAnimationManager
> {
  constructor(
    public id: EntityId,
    assetContainer: AssetContainer,
    startPosition: Vector3,
    public pointTowardEntity?: EntityId
  ) {
    super(id, assetContainer, startPosition, new Quaternion());
  }

  initRootMesh(assetContainer: AssetContainer): AbstractMesh {
    const rootMesh = assetContainer.meshes[0];
    if (!rootMesh) throw new Error("no meshes found");
    return rootMesh;
  }

  initAnimationManager(
    assetContainer: AssetContainer
  ): DynamicAnimationManager {
    return new DynamicAnimationManager(assetContainer);
  }

  customCleanup(): void {}
}
