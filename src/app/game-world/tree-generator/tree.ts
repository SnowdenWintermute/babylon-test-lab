import { TransformNode, Vector3 } from "@babylonjs/core";
import { RandomNumberGenerator } from "../random-number-generator";
import { TreeOptions } from "./tree-options/tree-options";
import { Branch } from "./branch";
import { Milliseconds } from "@/app/named-types";
import { LeafGeometryPrimitives } from "./leaf-geometry-primitives";
import { BranchGeometryPrimitives } from "./branch-geometry";

export class Tree {
  randomNumberGenerator: RandomNumberGenerator;
  transformNode: TransformNode;
  branchQueue: Branch[] = [];
  branchGeometryPrimitives = new BranchGeometryPrimitives();
  leafGeometryPrimitives = new LeafGeometryPrimitives();
  constructor(
    public name: string,
    public options = new TreeOptions()
  ) {
    this.randomNumberGenerator = new RandomNumberGenerator(options.seed);
    this.transformNode = new TransformNode(name);
  }

  generate() {
    const trunkOptions = this.options.branch.getOptionsAtLevel(0);
    // Create the trunk of the tree first
    this.branchQueue.push(
      new Branch(
        new Vector3(),
        new Vector3(),
        trunkOptions.length,
        trunkOptions.radius,
        0,
        trunkOptions.sectionCount,
        trunkOptions.segmentCount
      )
    );

    while (this.branchQueue.length > 0) {
      const branchOption = this.branchQueue.shift();
      if (!branchOption) break;

      // @TODO
      // this.generateBranch()
    }

    // @TODO
    // this.createBranchesGeometry()
    // @TODO
    // this.createLeavesGeometry()
  }

  update(elapsed: Milliseconds) {
    //
  }

  createBranchesGeometry() {
    throw new Error("not implemented");
  }

  createLeavesGeometry() {
    throw new Error("not implemented");
  }
}
