import {
  LoadAssetContainerAsync,
  Scene,
  Vector3,
  Node,
  Color4,
  MeshBuilder,
  DynamicTexture,
  StandardMaterial,
  AbstractMesh,
  Mesh,
  Quaternion,
} from "@babylonjs/core";
import { Radians } from "../named-types";
import { gameWorld } from "../scene-manager";

export const BASE_FILE_PATH = "";

export async function importAsset(path: string, scene: Scene) {
  if (path === "") throw new Error("Empty file path");

  const assetContainer = await LoadAssetContainerAsync(
    (BASE_FILE_PATH || "") + path,
    scene
  );
  assetContainer.addToScene();

  return assetContainer;
}

export function getPointOnArc(
  center: Vector3,
  radius: Radians,
  angle: Radians
) {
  const x = center.x + radius * Math.cos(angle);
  const z = center.z + radius * Math.sin(angle);
  const y = center.y;

  return new Vector3(x, y, z);
}

export function getChildNodeByName(mesh: Mesh | AbstractMesh, name: string) {
  for (const node of mesh.getDescendants(false)) {
    if (node.name === name) return node;
  }
  return undefined;
}

export function showBones(rootMesh: Mesh | AbstractMesh, armatureName: string) {
  const transparentMaterial = new StandardMaterial("");
  transparentMaterial.alpha = 0.3;
  for (const mesh of rootMesh.getChildMeshes()) {
    mesh.material = transparentMaterial;
  }
  const cubeSize = 0.02;
  const red = new Color4(255, 0, 0, 1.0);
  const skeletonRootBone = getChildNodeByName(rootMesh, armatureName);
  if (!gameWorld.current) return;
  if (skeletonRootBone !== undefined)
    paintCubesOnNodes(skeletonRootBone, cubeSize, red, gameWorld.current.scene);
}

export function paintCubesOnNodes(
  rootNode: Node,
  cubeSize: number,
  color: Color4,
  scene: Scene
) {
  for (const node of rootNode.getDescendants(false)) {
    const boneMarkerCube = MeshBuilder.CreateBox(
      `node-cube-${node.name}`,
      {
        height: cubeSize,
        width: cubeSize,
        depth: cubeSize,
        faceColors: new Array(6).fill(color),
      },
      scene
    );

    const billboard = createBillboard(node.name, scene);
    billboard.setParent(boneMarkerCube);
    billboard.setPositionWithLocalVector(new Vector3(0, 0, 0.1));

    boneMarkerCube.setParent(node);
    boneMarkerCube.setPositionWithLocalVector(new Vector3(0.0, 0.0, 0.0));
  }
}

export function createBillboard(text: string, scene: Scene) {
  const dynamicTexture = new DynamicTexture(
    "dynamic texture",
    { width: 512, height: 256 },
    scene,
    false
  );
  dynamicTexture.hasAlpha = true;
  dynamicTexture.drawText(
    text,
    null,
    140,
    "bold 10px Arial",
    "white",
    "transparent",
    true
  );

  // Apply it to a plane mesh
  const plane = MeshBuilder.CreatePlane("textPlane", { size: 1 }, scene);
  const material = new StandardMaterial("textMaterial", scene);
  material.diffuseTexture = dynamicTexture;
  material.backFaceCulling = false; // So text is visible from behind
  plane.material = material;

  // Set billboard mode
  plane.billboardMode = AbstractMesh.BILLBOARDMODE_ALL;
  return plane;
}

/**
 * Applies an Euler rotation to a vector by converting the Euler angles to a Quaternion.
 * @param vec The vector to rotate.
 * @param euler The Euler rotation angles in radians (XYZ order).
 * @returns The original Vector3 with the rotation applied.
 */
export function applyEuler(vec: Vector3, euler: Vector3): Vector3 {
  const quat = Quaternion.RotationYawPitchRoll(euler.y, euler.x, euler.z);
  return vec.rotateByQuaternionToRef(quat, vec);
}
