import {
  MeshBuilder,
  Quaternion,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { GameWorld } from ".";
import {
  getChildNodeByName,
  getPointOnArc,
  importAsset,
  showBones,
} from "./utils";
import { createDebugLines } from "./create-debug-lines";
import { pointTransformNodeToward } from "./point-transform-node-toward";

export async function testRotatingModels(gameWorld: GameWorld) {
  const box = MeshBuilder.CreateBox("", { size: 0.03 });

  const humanoidModel = await importAsset(
    // "/3d-assets/equipment/arrow.glb",
    "/3d-assets/humanoid/humanoid-skeleton.glb",
    gameWorld.scene
  );

  if (!humanoidModel.meshes[0]) return console.log("no meshes");

  showBones(humanoidModel.meshes[0], "CharacterArmature");

  humanoidModel.animationGroups[0]!.stop();

  humanoidModel.animationGroups
    .find((item) => item.name === "bow-shoot-full")!
    .play(true);

  const transformNode = new TransformNode("");
  const rootMesh = humanoidModel.meshes[0];
  if (!rootMesh) return;

  rootMesh.setParent(transformNode);
  rootMesh.setPositionWithLocalVector(Vector3.Zero());

  transformNode.position = new Vector3(2, 2, 0);

  createDebugLines(transformNode);

  // ARROW

  const arrowModel = await importAsset(
    "/3d-assets/equipment/arrow.glb",
    // "/3d-assets/humanoid/humanoid-skeleton.glb",
    this.scene
  );
  const arrowTransformNode = new TransformNode("");
  arrowModel.meshes[0]?.setParent(arrowTransformNode);
  arrowModel.meshes[0]?.setPositionWithLocalVector(Vector3.Zero());
  const equipmentBone = getChildNodeByName(rootMesh, "Equipment.L");
  if (!equipmentBone) throw new Error("no equipment bone");

  const boneIntermediaryTransformNode = new TransformNode("");
  boneIntermediaryTransformNode.setParent(equipmentBone);
  boneIntermediaryTransformNode.setPositionWithLocalVector(Vector3.Zero());

  arrowTransformNode.setParent(boneIntermediaryTransformNode);
  arrowTransformNode.setPositionWithLocalVector(Vector3.Zero());
  createDebugLines(arrowTransformNode);
  //

  const movementNode = new TransformNode("");

  movementNode.position = new Vector3(2, 2, 0);

  createDebugLines(movementNode);

  transformNode.setParent(movementNode);
  transformNode.setPositionWithLocalVector(Vector3.Zero());
  transformNode.rotationQuaternion = new Quaternion();

  const targetMesh = MeshBuilder.CreateIcoSphere("", { radius: 0.03 });
  const targetTransformNode = new TransformNode("");
  targetMesh.setParent(targetTransformNode);

  gameWorld.updateFunctions = [];

  gameWorld.updateFunctions.push(() => {
    const timestamp = Date.now();
    const amountToMove = gameWorld.engine.getTimeStep() / 3009;

    let angularVelocity = (2 * Math.PI) / 100000;
    angularVelocity = 0;
    const angle = timestamp * angularVelocity;
    const pointOnArc = getPointOnArc(Vector3.Zero(), 4, angle);

    let targetMeshAngularVelocity = (2 * -Math.PI) / 50000;
    targetMeshAngularVelocity = 0;

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

    movementNode.computeWorldMatrix(true);
    transformNode.computeWorldMatrix(true);
    humanoidModel.meshes[0]?.computeWorldMatrix(true);
    humanoidModel.skeletons[0]?.prepare();
    boneIntermediaryTransformNode.computeWorldMatrix(true);
    arrowTransformNode.computeWorldMatrix(true);
    pointTransformNodeToward(transformNode, targetTransformNode.position);
    pointTransformNodeToward(arrowTransformNode, targetTransformNode.position);
  });
}
