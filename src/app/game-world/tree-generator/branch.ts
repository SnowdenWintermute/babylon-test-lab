import { Vector3 } from "@babylonjs/core";

export class Branch {
  origin: Vector3;
  orientation: Vector3;
  constructor(
    origin: Vector3,
    orientation: Vector3,
    public length: number,
    public radius: number,
    public recursionLevel: number,
    public sectionCount: number,
    public segmentCount: number
  ) {
    this.origin = origin.clone();
    this.orientation = orientation.clone();
  }
}
