import * as THREE from "three";

import { BaseObject } from "./base-object";
import { Physics2D } from "./physics2d";
import { MathUtils } from "three";
import particleImage from "./assets/png/confetti.png";
import fragGlsl from "./assets/fragshader.glsl";
import vertexGlsl from "./assets/vertexshader.glsl";
import * as loader from "./utils/resource-manager";

export class Particle extends BaseObject {
  object: THREE.Group;
  time = 0;
  materialShader: THREE.Shader;
  material: THREE.PointsMaterial;
  pointList: THREE.Vector3[] = [];
  geometry: THREE.BufferGeometry;
  constructor(mainScene: THREE.Scene, world: Physics2D) {
    super(mainScene, world, "particle");
  }
  async init(): Promise<void> {
    this.geometry = new THREE.BufferGeometry();
    const particleTexture = await loader.loadTexture(particleImage);
    const fragShader = fragGlsl;
    const vertexShader = vertexGlsl;
    this.material = new THREE.PointsMaterial({
      size: 0.3,
      transparent: true,
      //vertexColors: true,
      map: particleTexture,
    });
    console.log(THREE.ShaderChunk.common);
    this.material.onBeforeCompile = (shader): void => {
      shader.fragmentShader = fragShader;
      shader.vertexShader = vertexShader;
      shader.uniforms.time = { value: 0.0 };
      //console.log(shader.fragmentShader);
      //console.log(shader.uniforms);
      this.materialShader = shader;
    };
    const count = 200;
    const area = 1.5;
    for (let i = 0; i < count; i++) {
      const x = MathUtils.randFloat(-area, area);
      const y = MathUtils.randFloat(-area, area);
      const z = MathUtils.randFloat(-area, area);
      this.pointList.push(new THREE.Vector3(x, y, z));
    }
    this.geometry.setFromPoints(this.pointList);
    const colorAttribute = new THREE.BufferAttribute(
      new Float32Array(count),
      1
    );
    for (let i = 0; i < colorAttribute.count; i++) {
      const colorIndex = MathUtils.randInt(0, 8);
      colorAttribute.setX(i, colorIndex);
    }
    this.geometry.setAttribute("type", colorAttribute);

    const particle = new THREE.Points(this.geometry, this.material);
    this.object.add(particle);
    this.object.position.setZ(0);

    this.mainScene.add(this.object);
  }
  update(deltaTime: number): void {
    this.time += deltaTime;
    if (this.materialShader) {
      this.materialShader.uniforms.time.value = this.time;
    }
    //this.pointList.forEach((item) => {
    //  item.y -= deltaTime * (deltaTime * 20);
    //});
    //this.geometry.setFromPoints(this.pointList);

    //this.object.rotateX(0.1 * deltaTime);
    return;
  }
}
