import { BarkType, Billboard, LeafType, TreeType } from "./enums";
import { BranchOptions } from "./branch-options";

export class TreeOptions {
  public seed = 0;
  type: TreeType = TreeType.Deciduous;
  bark = {
    type: BarkType.Oak, // The bark texture
    tint: 0xffffff, // Tint of the tree trunk
    flatShading: false, // Use face normals for shading instead of vertex normals
    textured: true, // Apply texture to bark
    textureScale: { x: 1, y: 1 }, // Scale for the texture
  };

  branch = new BranchOptions();

  leaves = {
    type: LeafType.Oak, // Leaf texture to use
    billboard: Billboard.Double, // Whether to use single or double/perpendicular billboards
    angle: 10, // Angle of leaves relative to parent branch (degrees)
    count: 1, // Number of leaves
    start: 0, // Where leaves start to grow on the length of the branch (0 to 1)
    size: 2.5, // Size of the leaves
    sizeVariance: 0.7, // Variance in leaf size between each instance
    tint: 0xffffff, // Tint color for the leaves
    alphaTest: 0.5, // Controls transparency of leaf texture
  };
  constructor() {}
}
