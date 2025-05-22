import { Degrees, NormalizedPercentage } from "@/app/named-types";
import { Vector3 } from "@babylonjs/core";

export interface BranchNodeOptions {
  // only on non-root nodes
  angleRelativeToParent?: Degrees;
  startLocationRelativeToParent?: NormalizedPercentage;
  // only on non-leaf nodes
  childCount?: number;
  // all branches
  gnarliness: number; // Amount of curling/twisting
  length: number;
  radius: number; // Branch thickness
  sectionCount: number; // Defines how many times branch is subdivided along its length.
  segmentCount: number; // Controls the smoothness by setting the number of segments around the trunk’s circumference.
  taper: NormalizedPercentage;
  twist: NormalizedPercentage;
}

export class BranchOptions {
  recursionLevelCount: number = 3; // 0 = trunk only
  // External force encouraging tree growth in a particular direction
  force = {
    direction: new Vector3(0, 1, 0),
    strength: 0.01,
  };

  optionsByLevel: BranchNodeOptions[] = [
    {
      gnarliness: 0.15,
      length: 20,
      radius: 1.5,
      sectionCount: 12,
      segmentCount: 8,
      taper: 0.7,
      twist: 0,
      childCount: 7,
    },
    {
      gnarliness: 0.2,
      length: 20,
      radius: 0.7,
      sectionCount: 10,
      segmentCount: 6,
      taper: 0.7,
      twist: 0,
      childCount: 7,
      startLocationRelativeToParent: 0.4,
      angleRelativeToParent: 70,
    },
    {
      gnarliness: 0.3,
      length: 10,
      radius: 0.7,
      sectionCount: 8,
      segmentCount: 4,
      taper: 0.7,
      twist: 0,
      childCount: 5,
      startLocationRelativeToParent: 0.3,
      angleRelativeToParent: 60,
    },
    {
      gnarliness: 0.02,
      length: 1,
      radius: 0.7,
      sectionCount: 6,
      segmentCount: 3,
      taper: 0.7,
      twist: 0,
      startLocationRelativeToParent: 0.3,
      angleRelativeToParent: 60,
    },
  ];

  constructor() {}

  getOptionsAtLevel(recursionLevel: number) {
    const trunkOptionsOption = this.optionsByLevel[recursionLevel];
    if (trunkOptionsOption === undefined)
      throw new Error("Expected branch options not found");
    return trunkOptionsOption;
  }
}
