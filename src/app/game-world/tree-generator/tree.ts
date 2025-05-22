import { TransformNode, Vector3 } from "@babylonjs/core";
import { RandomNumberGenerator } from "../random-number-generator";
import { TreeOptions } from "./tree-options/tree-options";
import { Branch } from "./branch";
import { Milliseconds } from "@/app/named-types";
import { BranchGeometry } from "./branch-geometry";
import { LeafGeometry } from "./leaf-geometry";

export class Tree {
  randomNumberGenerator: RandomNumberGenerator;
  transformNode: TransformNode;
  branchQueue: Branch[] = [];
  branchGeometry = new BranchGeometry();
  leafGeometry = new LeafGeometry();
  constructor(
    public name: string,
    public options = new TreeOptions()
  ) {
    this.randomNumberGenerator = new RandomNumberGenerator(options.seed);
    this.transformNode = new TransformNode(name);
  }

  generate() {
    //    // Create the trunk of the tree first
    this.branchQueue.push(
      new Branch(
        new Vector3(),
        new Vector3(),
        this.options.branch.length[0],
        this.options.branch.radius[0],
        0,
        this.options.branch.sections[0],
        this.options.branch.segments[0]
      )
    );
  }

  update(elapsed: Milliseconds) {
    //
  }
}
