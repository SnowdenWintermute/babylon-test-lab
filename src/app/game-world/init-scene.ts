import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
  Color4,
  PointLight,
  StandardMaterial,
  Mesh,
  DynamicTexture,
  GlowLayer,
  Color3,
} from "@babylonjs/core";
import { GameWorld } from ".";

export const GROUND_COLOR = "#344b35";
export const GROUND_WIDTH = 50;
export const GROUND_HEIGHT = 50;
export const RESOLUTION_PER_BABYLON_UNIT = 100;
export const GROUND_TEXTURE_WIDTH = GROUND_WIDTH * RESOLUTION_PER_BABYLON_UNIT;
export const GROUND_TEXTURE_HEIGHT =
  GROUND_HEIGHT * RESOLUTION_PER_BABYLON_UNIT;

export function initScene(
  this: GameWorld
): [ArcRotateCamera, Mesh, DynamicTexture] {
  // this.scene.clearColor = new Color4(0.1, 0.1, 0.15, 1);

  this.scene.clearColor = new Color4(0, 0, 0, 0);

  const camera = new ArcRotateCamera(
    "camera",
    0,
    0,
    0,
    new Vector3(0, 1, 0),
    this.scene
  );
  camera.alpha = Math.PI / 2;
  camera.beta = (Math.PI / 5) * 2;
  camera.radius = 4.28;
  camera.wheelDeltaPercentage = 0.01;
  camera.attachControl();
  camera.minZ = 0;

  // ORTHO setup
  // setupOrthoCamera()

  // LIGHTS
  const hemiLight = new HemisphericLight(
    "hemi-light",
    new Vector3(0, 1, 0),
    this.scene
  );
  hemiLight.specular = Color3.FromHexString(GROUND_COLOR);
  hemiLight.intensity = 0.85;
  // hemiLight.intensity = 0.0;
  const lightPosition = new Vector3(4.0, 20.0, 8.0);
  const pointLight = new PointLight("point-light", lightPosition, this.scene);
  const ball = MeshBuilder.CreateSphere("ball", { diameter: 0.25 }, this.scene);
  const sunMaterial = new StandardMaterial("sun material");
  sunMaterial.emissiveColor = new Color3(1, 1, 1);
  ball.material = sunMaterial;
  ball.position = lightPosition;
  pointLight.intensity = 0.2;
  // pointLight.intensity = 0.0;

  const glowLayer = new GlowLayer("glow", this.scene);
  // Adjust glow intensity
  glowLayer.intensity = 0.5;

  const ground = MeshBuilder.CreateGround(
    "ground1",
    { width: GROUND_WIDTH, height: GROUND_HEIGHT, subdivisions: 25 },
    this.scene
  );

  // Create dynamic texture
  const groundTexture = new DynamicTexture(
    "dynamic texture",
    GROUND_TEXTURE_WIDTH,
    this.scene
  );
  this.groundTexture = groundTexture;

  const materialGround = new StandardMaterial("Mat", this.scene);
  materialGround.diffuseTexture = groundTexture;
  ground.material = materialGround;
  this.clearFloorTexture();

  return [camera, ball, groundTexture];
}
