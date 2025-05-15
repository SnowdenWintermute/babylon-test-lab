import { Scene, Vector3 } from "@babylonjs/core";
import { importAsset } from "../../utils";

export async function spawnActionEntityModel(
  modelPath: string,
  position: Vector3,
  scene: Scene
) {
  if (!scene) throw new Error("no game world");
  const model = await importAsset(modelPath, scene);

  return model;
}
