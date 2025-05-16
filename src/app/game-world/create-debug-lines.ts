import {
  Color3,
  MeshBuilder,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

export function createDebugLines(rootTransformNode: TransformNode) {
  const start = Vector3.Zero();
  const positiveZ = start.add(new Vector3(0, 0, 10));

  const positiveZline = MeshBuilder.CreateLines("line", {
    points: [start, positiveZ],
  });
  const negativeZ = start.add(new Vector3(0, 0, -1));
  const negativeZline = MeshBuilder.CreateLines("line", {
    points: [start, negativeZ],
  });

  const lineMaterial = new StandardMaterial("lineMat");
  lineMaterial.diffuseColor = new Color3(0, 1, 1);
  negativeZline.material = lineMaterial;

  positiveZline.setParent(rootTransformNode);
  positiveZline.setPositionWithLocalVector(Vector3.Zero());

  negativeZline.setParent(rootTransformNode);
  negativeZline.setPositionWithLocalVector(Vector3.Zero());

  const testMesh = MeshBuilder.CreateBox("", { size: 0.1 });

  testMesh.setParent(rootTransformNode);
  testMesh.setPositionWithLocalVector(Vector3.Zero());
}
