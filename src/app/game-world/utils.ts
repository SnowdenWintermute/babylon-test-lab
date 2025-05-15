import { LoadAssetContainerAsync, Scene } from "@babylonjs/core";

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
