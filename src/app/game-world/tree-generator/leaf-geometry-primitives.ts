import { Vector2, Vector3 } from "@babylonjs/core";

export class LeafGeometryPrimitives {
  verts: Vector3[] = [];
  indices: number[] = [];
  normals: Vector3[] = [];
  uvs: Vector2[] = [];
  constructor() {}

  cleanup() {
    this.verts = [];
    this.indices = [];
    this.normals = [];
    this.uvs = [];
  }
}
