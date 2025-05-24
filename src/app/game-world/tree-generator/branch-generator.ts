import { Quaternion, Vector2, Vector3 } from "@babylonjs/core";
import { Branch } from "./branch";
import { BranchGeometryPrimitives } from "./branch-geometry-primitives";
import { TreeType } from "./tree-options/enums";
import { TreeOptions } from "./tree-options/tree-options";
import { QuaternionUtils, Vector3Utils } from "../utils";
import { getVector3ValuesAsXYZArray } from "@/app/utils";
import { RandomNumberGenerator } from "../random-number-generator";
import { BranchNodeOptions } from "./tree-options/branch-options";

const BRANCH_TIP_RADIUS = 0.001;

export class BranchGenerator {
  constructor(
    private treeOptions: TreeOptions,
    private branchGeometryPrimitives: BranchGeometryPrimitives,
    private randomNumberGenerator: RandomNumberGenerator
  ) {}
  generateBranch(branch: Branch) {
    // Used later for geometry index generation
    const indexOffset = this.branchGeometryPrimitives.verts.length / 3;

    const sectionOrientation = branch.orientation.clone();
    const sectionOrigin = branch.origin.clone();
    const sectionLength =
      branch.length /
      branch.sectionCount /
      (this.treeOptions.type === TreeType.Deciduous
        ? this.treeOptions.branch.recursionLevelCount - 1
        : 1);

    // This information is used for generating child branches after the branch
    // geometry has been constructed
    const sections = [];

    const branchNodeOptions = this.treeOptions.branch.getOptionsAtLevel(
      branch.recursionLevel
    );

    for (
      let branchSectionIndex = 0;
      branchSectionIndex <= branch.sectionCount;
      branchSectionIndex++
    ) {
      const sectionRadius = this.calculateSectionRadius(
        branch,
        branchSectionIndex,
        branchNodeOptions
      );

      // Create the segments that make up this section.
      let first;
      for (
        let segmentIndex = 0;
        segmentIndex < branch.segmentCount;
        segmentIndex++
      ) {
        const angle = (2.0 * Math.PI * segmentIndex) / branch.segmentCount;

        // Create the segment vertex
        const vertex = Vector3Utils.applyEuler(
          new Vector3(Math.cos(angle), 0, Math.sin(angle)).scale(sectionRadius),
          sectionOrientation
        ).add(sectionOrigin);

        const normal = Vector3Utils.applyEuler(
          new Vector3(Math.cos(angle), 0, Math.sin(angle)),
          sectionOrientation
        ).normalize();

        const uv = new Vector2(
          segmentIndex / branch.segmentCount,
          branchSectionIndex % 2 === 0 ? 0 : 1
        );

        this.branchGeometryPrimitives.verts.push(...Object.values(vertex));
        this.branchGeometryPrimitives.normals.push(...Object.values(normal));
        this.branchGeometryPrimitives.uvs.push(...Object.values(uv));

        if (segmentIndex === 0) first = { vertex, normal, uv };
      }

      if (first === undefined)
        throw new Error("no geometry primitives could be generated");

      // Duplicate the first vertex so there is continuity in the UV mapping
      this.branchGeometryPrimitives.verts.push(
        ...getVector3ValuesAsXYZArray(first.vertex)
      );
      this.branchGeometryPrimitives.normals.push(
        ...getVector3ValuesAsXYZArray(first.normal)
      );
      this.branchGeometryPrimitives.uvs.push(1, first.uv.y);

      // Use this information later on when generating child branches
      sections.push({
        origin: sectionOrigin.clone(),
        orientation: sectionOrientation.clone(),
        radius: sectionRadius,
      });

      sectionOrigin.add(
        Vector3Utils.applyEuler(
          new Vector3(0, sectionLength, 0),
          sectionOrientation
        )
      );

      this.applyGnarliness(
        sectionRadius,
        branchNodeOptions,
        sectionOrientation
      );

      // Apply growth force to the branch
      const qSection = Quaternion.FromEulerAngles(
        sectionOrientation.x,
        sectionOrientation.y,
        sectionOrientation.z
      );

      const qTwist = Quaternion.RotationAxis(
        Vector3.Up(),
        branchNodeOptions.twist
      );

      const qForce = Quaternion.FromUnitVectorsToRef(
        Vector3.Up(),
        this.treeOptions.branch.force.direction,
        new Quaternion()
      );

      qSection.multiply(qTwist);

      QuaternionUtils.RotateTowards(
        qSection,
        qForce,
        this.treeOptions.branch.force.strength
      );

      Vector3Utils.setFromQuaternion(sectionOrientation, qSection);
    }

    this.generateBranchIndices(indexOffset, branch);

    // Deciduous trees have a terminal branch that grows out of the
    // end of the parent branch
    if (this.options.type === "deciduous") {
      const lastSection = sections[sections.length - 1];

      if (branch.level < this.options.branch.levels) {
        this.branchQueue.push(
          new Branch(
            lastSection.origin,
            lastSection.orientation,
            this.options.branch.length[branch.level + 1],
            lastSection.radius,
            branch.level + 1,
            // Section count and segment count must be same as parent branch
            // since the child branch is growing from the end of the parent branch
            branch.sectionCount,
            branch.segmentCount
          )
        );
      } else {
        this.generateLeaf(lastSection.origin, lastSection.orientation);
      }
    }

    // If we are on the last branch level, generate leaves
    if (branch.level === this.options.branch.levels) {
      this.generateLeaves(sections);
    } else if (branch.level < this.options.branch.levels) {
      this.generateChildBranches(
        this.options.branch.children[branch.level],
        branch.level + 1,
        sections
      );
    }
  }

  private calculateSectionRadius(
    branch: Branch,
    branchSectionIndex: number,
    branchNodeOptions: BranchNodeOptions
  ) {
    let sectionRadius = branch.radius;

    // If final section of final level, set radius to effecively zero
    if (
      branchSectionIndex === branch.sectionCount &&
      branch.recursionLevel === this.treeOptions.branch.recursionLevelCount
    ) {
      sectionRadius = BRANCH_TIP_RADIUS;
    } else if (this.treeOptions.type === TreeType.Deciduous) {
      return (
        sectionRadius * 1 -
        branchNodeOptions.taper * (branchSectionIndex / branch.sectionCount)
      );
    } else if (this.treeOptions.type === TreeType.Evergreen) {
      // Evergreens do not have a terminal branch so they have a taper of 1
      return sectionRadius * 1 - branchSectionIndex / branch.sectionCount;
    }

    return sectionRadius;
  }

  private applyGnarliness(
    sectionRadius: number,
    branchNodeOptions: BranchNodeOptions,
    sectionOrientation: Vector3
  ) {
    // Perturb the orientation of the next section randomly. The higher the
    // gnarliness, the larger potential perturbation
    const gnarliness =
      Math.max(1, 1 / Math.sqrt(sectionRadius)) * branchNodeOptions.gnarliness;

    sectionOrientation.x += this.randomNumberGenerator.randBetween(
      gnarliness,
      -gnarliness
    );
    sectionOrientation.z += this.randomNumberGenerator.randBetween(
      gnarliness,
      -gnarliness
    );
  }
}
