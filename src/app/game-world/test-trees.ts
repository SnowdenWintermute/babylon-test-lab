import { Scene } from "@babylonjs/core";
import { TreeGenerator } from "./tree-generator";

export function testTrees(scene: Scene) {
  const treeGenerator = new TreeGenerator({
    seed: 1,
    branch: {
      length: [2],
      radius: [0.5],
      sections: [2],
      segments: [4],
      taper: [1],
    },
  });

  treeGenerator.createCustomMesh(scene);
}
