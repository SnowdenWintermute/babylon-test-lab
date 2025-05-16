import { LoadAssetContainerAsync, Scene, Vector3 } from "@babylonjs/core";
import { Radians } from "../named-types";

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
