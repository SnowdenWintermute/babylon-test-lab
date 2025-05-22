export class BranchGeometryPrimitives {
  verts: number[] = [];
  indices: number[] = [];
  normals: number[] = [];
  uvs: number[] = [];
  constructor() {}

  cleanup() {
    this.verts = [];
    this.indices = [];
    this.normals = [];
    this.uvs = [];
  }
}
