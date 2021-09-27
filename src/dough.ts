import * as THREE from "three";

import { BaseObject } from "./base-object";
import { Physics } from "./physics";
import { Physics2D } from "./physics2d";
// import * as loader from './utils/resource-manager';

export class Dough extends BaseObject {
  object: THREE.Group;
  constructor(mainScene: THREE.Scene, world: Physics) {
    super(mainScene, world, "dough");
  }
  async init(): Promise<void> {
    const geometry = new THREE.SphereBufferGeometry(1, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0xaabb00 });
    const sphere = new THREE.Mesh(geometry, material);
    this.object.add(sphere);

    this.mainScene.add(this.object);
  }
  update(deltaTime: number): void {
    this.object.rotateX(0.1 * deltaTime);
    return;
  }
}
