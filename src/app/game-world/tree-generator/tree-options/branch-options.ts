import { Vector3 } from "@babylonjs/core";

export class BranchOptions {
  recursionLevelCount: number = 3; // 0 = trunk only
  // Angle of the child branches relative to the parent branch (degrees)
  childRelativeAnglesByLevel: Record<number, number> = {
    1: 70,
    2: 60,
    3: 60,
  };
  childCountByLevel: Record<number, number> = {
    0: 7,
    1: 7,
    2: 5,
  };
  // External force encouraging tree growth in a particular direction
  force = {
    direction: new Vector3(0, 1, 0),
    strength: 0.01,
  };
  // Amount of curling/twisting at each branch level
  gnarliness: Record<number, number> = {
    0: 0.15,
    1: 0.2,
    2: 0.3,
    3: 0.02,
  };

  lengthsByLevel: Record<number, number> = {
    0: 20,
    1: 20,
    2: 10,
    3: 1,
  };

  // Radius of each branch level
  radius: Record<number, number> = {
    0: 1.5,
    1: 0.7,
    2: 0.7,
    3: 0.7,
  };

  // Number of sections per branch level
  sectionCountByLevel: Record<number, number> = {
    0: 12,
    1: 10,
    2: 8,
    3: 6,
  };

  // Number of radial segments per branch level
  segmentCountByLevel: Record<number, number> = {
    0: 8,
    1: 6,
    2: 4,
    3: 3,
  };

  // Defines where child branches start forming on the parent branch
  start: Record<number, number> = {
    1: 0.4,
    2: 0.3,
    3: 0.3,
  };

  // Taper at each branch level
  tapersByLevel: Record<number, number> = {
    0: 0.7,
    1: 0.7,
    2: 0.7,
    3: 0.7,
  };

  // Amount of twist at each branch level
  twist: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  };
  constructor() {}
}
