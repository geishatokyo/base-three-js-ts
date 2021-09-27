import * as THREE from "three";

import { BaseObject } from "./base-object";
import { Physics } from "./physics";
import { Physics2D } from "./physics2d";
// import * as loader from './utils/resource-manager';

export class Cube extends BaseObject {
  object: THREE.Group;
  constructor(mainScene: THREE.Scene, world: Physics) {
    super(mainScene, world, "cube");
  }
  async init(): Promise<void> {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    const material = new THREE.MeshLambertMaterial({ color: 0x987654 });
    const cube = new THREE.Mesh(geometry, material);
    this.object.add(cube);

    this.mainScene.add(this.object);
    this.object.position.set(1, 1, 1);
  }
  update(deltaTime: number): void {
    this.object.rotateY(0.1 * deltaTime);
    return;
  }
}
