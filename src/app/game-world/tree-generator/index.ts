import { Mesh, Scene, Vector2, Vector3, VertexData } from "@babylonjs/core";
import { RandomNumberGenerator } from "../random-number-generator";
import { Branch } from "./branch";
import { applyEuler } from "../utils";

export class TreeGenerator {
  rng = new RandomNumberGenerator(1);
  branchQueue: Branch[] = [];
  branches: {
    verts: Vector3[];
    indices: number[];
    normals: Vector3[];
    uvs: Vector2[];
  } = {
    verts: [],
    indices: [],
    normals: [],
    uvs: [],
  };
  // branches;
  constructor(
    public options: {
      seed: number;
      branch: {
        length: number[];
        radius: number[];
        sections: number[];
        segments: number[];
        taper: number[];
      };
    }
  ) {
    for (let i = 10; i > 0; i -= 1) console.log(this.rng.randBetween(0, 1));
  }
  // The starting point for the tree generation process
  generate() {
    // // Initialize geometry data
    // this.branches = {};
    // this.leaves = {};
    // // Initialize RNG
    this.rng = new RandomNumberGenerator(this.options.seed);
    // // Start with the trunk
    this.branchQueue.push(
      new Branch(
        Vector3.Zero(),
        Vector3.Zero(), // Orientation
        2, // Length
        0.5, // Radius
        0, // Recursion level
        3, // # of sections
        3 // # of segments
      )
    );
    // // Process branches in the queue
    while (this.branchQueue.length > 0) {
      const branchOption = this.branchQueue.shift();
      if (!branchOption) break;
      //   this.generateBranch(branch);
    }
  }

  generateBranch(branch: Branch) {
    const sectionOrigin = branch.origin.clone();
    const sectionOrientation = branch.orientation.clone();
    const sectionLength = branch.length / branch.sectionCount;

    const sections: {
      origin: Vector3;
      orientation: Vector3;
      radius: number;
    }[] = [];

    for (let i = 0; i <= branch.sectionCount; i++) {
      // Calculate section radius
      let sectionRadius = branch.radius;
      // If last section, set radius to effectively zero
      if (i === branch.sectionCount) sectionRadius = 0.001;
      else {
        const taperOnThisLevel =
          this.options.branch.taper[branch.recursionLevel];
        if (!taperOnThisLevel) throw new Error("no taper found");
        sectionRadius *= 1 - taperOnThisLevel * (i / branch.sectionCount);
      }

      // Build section geometry
      // Create the segments that make up this section.
      for (
        let segmentIndex = 0;
        segmentIndex < branch.segmentCount;
        segmentIndex++
      ) {
        const angle = (2.0 * Math.PI * segmentIndex) / branch.segmentCount;

        const vertex = applyEuler(
          new Vector3(Math.cos(angle), 0, Math.sin(angle)).scale(sectionRadius),
          sectionOrientation
        ).add(sectionOrigin);

        const normal = applyEuler(
          new Vector3(Math.cos(angle), 0, Math.sin(angle)),
          sectionOrientation
        ).normalize();

        const uv = new Vector2(
          segmentIndex / branch.segmentCount,
          i % 2 === 0 ? 0 : 1
        );

        this.branches.verts.push(...Object.values(vertex));
        this.branches.normals.push(...Object.values(normal));
        this.branches.uvs.push(...Object.values(uv));
      }

      sections.push({
        origin: sectionOrigin.clone(),
        orientation: sectionOrientation.clone(),
        radius: sectionRadius,
      });
    }
  }

  createCustomMesh(scene: Scene): Mesh {
    const mesh = new Mesh("custom", scene);

    const positions = [0, 0, 0, 0, 1, 0, 1, 0, 0];

    const indices = [0, 1, 2];

    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;

    vertexData.applyToMesh(mesh);
    return mesh;
  }

  // createBranchesGeometry() {
  //   const g = new THREE.BufferGeometry();
  //   // const geometry = new Mesh
  //   g.setAttribute(
  //     'position',
  //     new THREE.BufferAttribute(new Float32Array(this.branches.verts), 3),
  //   );
  //   g.setAttribute(
  //     'normal',
  //     new THREE.BufferAttribute(new Float32Array(this.branches.normals), 3),
  //   );
  //   g.setAttribute(
  //     'uv',
  //     new THREE.BufferAttribute(new Float32Array(this.branches.uvs), 2),
  //   );
  //   g.setIndex(
  //     new THREE.BufferAttribute(new Uint16Array(this.branches.indices), 1),
  //   );
  //   g.computeBoundingSphere();

  //   const mat = new THREE.MeshPhongMaterial({
  //     name: 'branches',
  //     flatShading: this.options.bark.flatShading,
  //     color: new THREE.Color(this.options.bark.tint),
  //   });

  //   if (this.options.bark.textured) {
  //     mat.aoMap = getBarkTexture(this.options.bark.type, 'ao', this.options.bark.textureScale);
  //     mat.map = getBarkTexture(this.options.bark.type, 'color', this.options.bark.textureScale);
  //     mat.normalMap = getBarkTexture(this.options.bark.type, 'normal', this.options.bark.textureScale);
  //     mat.roughnessMap = getBarkTexture(this.options.bark.type, 'roughness', this.options.bark.textureScale);
  //   }

  //   this.branchesMesh.geometry.dispose();
  //   this.branchesMesh.geometry = g;
  //   this.branchesMesh.material.dispose();
  //   this.branchesMesh.material = mat;
  //   this.branchesMesh.castShadow = true;
  //   this.branchesMesh.receiveShadow = true;
  // }
}
