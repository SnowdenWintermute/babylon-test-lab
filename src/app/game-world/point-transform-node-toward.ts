import { Matrix, Quaternion, TransformNode, Vector3 } from "@babylonjs/core";

export function pointTransformNodeToward(
  transformNode: TransformNode,
  targetPosition: Vector3
) {
  const worldPos = transformNode.getAbsolutePosition();
  const lookAtMatrix = Matrix.LookAtLH(worldPos, targetPosition, Vector3.Up());

  // Invert because LookAtLH returns a view matrix
  const worldRotation = Quaternion.FromRotationMatrix(lookAtMatrix).invert();

  if (transformNode.parent) {
    // Convert world rotation to local space
    const parentWorldMatrix = transformNode.parent.getWorldMatrix();
    const parentRotation = Quaternion.FromRotationMatrix(
      parentWorldMatrix.getRotationMatrix()
    );

    // localRotation = inverse(parent) * worldRotation
    const localRotation = parentRotation.conjugate().multiply(worldRotation);
    transformNode.rotationQuaternion = localRotation;
  } else {
    transformNode.rotationQuaternion = worldRotation;
  }
}
