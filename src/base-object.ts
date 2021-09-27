import * as THREE from "three";
import { Physics } from "./physics";
import { Physics2D } from "./physics2d";

export abstract class BaseObject {
  object: THREE.Group;
  mainScene: THREE.Scene;
  physicsWorld: Physics;
  constructor(mainScene: THREE.Scene, world: Physics, name: string) {
    this.mainScene = mainScene;
    this.object = new THREE.Group();
    this.object.name = name;
    this.object.userData["tag"] = name;
    this.physicsWorld = world;
  }
  abstract init(): Promise<void>;
  abstract update(deltaTime: number): void;
}
