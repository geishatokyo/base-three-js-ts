import "./assets/main.css";

import * as THREE from "three";

import { controller } from "./controller";
import { Dough } from "./dough";
import { uiController } from "./ui";
import { Physics2D } from "./physics2d";
import { Cube } from "./cube";
import Ammo from "ammo.js";
import { Particle } from "./particle";

export class App {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clock = new THREE.Clock();
  needResize = false;
  state = 0;
  physicsWorld: Physics2D;
  dough: Dough;
  particle: Particle;
  size = { width: 0, height: 0 };
  cube: Cube;
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.getElementById("main-scene") as HTMLCanvasElement,
    });
    this.renderer.setClearColor(0x2f3c29, 1.0);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, undefined, 0.3, 1000);
    this.camera.position.set(0, 4, -3);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // light
    const light = new THREE.DirectionalLight(0xebd6c8, 1.1);
    light.position.set(-5, 3, -3);
    const ambientLight = new THREE.AmbientLight(0xa2a8b6, 1.1);
    this.scene.add(light);
    this.scene.add(ambientLight);

    //physics
    this.physicsWorld = new Physics2D();

    // object
    this.dough = new Dough(this.scene, this.physicsWorld);
    this.cube = new Cube(this.scene, this.physicsWorld);
    this.particle = new Particle(this.scene, this.physicsWorld);
  }

  async init(): Promise<void> {
    this.windowResize();
    controller.init();
    uiController.init();
    await Promise.all([
      this.dough.init(),
      this.cube.init(),
      this.particle.init(),
    ]);
    await this.physicsWorld.init();
    uiController.hideLoading();
    //const shape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1));
    this.physicsWorld.createRigidBody(
      this.cube.object
      //shape,
      //1,
      //new THREE.Vector3(1, 1, 1),
      //new THREE.Quaternion()
    );
  }
  render(): void {
    const deltaTime = this.clock.getDelta();
    if (this.needResize) {
      this.windowResize();
      this.needResize = false;
    }
    this.physicsWorld.updatePhysics(deltaTime);
    this.mainloop(deltaTime);
    this.dough.update(deltaTime);
    this.cube.update(deltaTime);
    this.particle.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  windowResize(): void {
    const width = document.getElementById("canvas-frame").clientWidth;
    const height = document.getElementById("canvas-frame").clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    uiController.setSize(height, width);
  }
  bindWindowEvent(window: Window): void {
    window.addEventListener("resize", () => {
      this.needResize = true;
    });
  }
  setFullScreenInstall(): void {
    const eventName = "ontouchstart" in window ? "touchstart" : "click";
    document
      .getElementById("install")
      .removeEventListener(eventName, uiController.installClick, false);

    controller.clickHandler = (): void => {
      uiController.installClick();
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mainloop(deltaTime: number): void {
    switch (this.state) {
      case 0:
        break;
    }
    return;
  }

  resizeRequest(width: number, height: number): void {
    this.size = { width, height };
    this.needResize = true;
  }
  run(): void {
    this.render();
  }
}
