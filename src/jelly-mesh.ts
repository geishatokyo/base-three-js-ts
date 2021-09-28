import * as THREE from "three";
import { BaseObject } from "./base-object";
import { Physics } from "./physics";

class JellyVertex {
  public id: number;
  public position: THREE.Vector3 = new THREE.Vector3();
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public force: THREE.Vector3 = new THREE.Vector3();

  constructor(_id: number, _position: THREE.Vector3) {
    this.id = _id;
    this.position.copy(_position);
  }
  shake(target: THREE.Vector3, m: number, s: number, d: number) {
    this.force.copy(target).sub(this.position).multiplyScalar(s);
    const mForce = this.force.clone().multiplyScalar(1 / m);
    this.velocity.add(mForce).multiplyScalar(d);
    this.position.add(this.velocity);
    const lengthSq = this.velocity
      .clone()
      .add(this.force)
      .add(mForce)
      .lengthSq();
    if (lengthSq < 0.0001) {
      this.position.copy(target);
    }
  }
}

export class JellyMesh extends BaseObject {
  private _originMesh: THREE.Mesh;
  private _meshClone: THREE.Mesh;
  private _jv: JellyVertex[] = [];
  public intensity = 8;
  public mass = 2;
  public stiffness = 1;
  public damping = 0.75;
  public time = 0;

  constructor(originMesh: THREE.Mesh, mainScene: THREE.Scene, world: Physics) {
    super(mainScene, world, "jellyMesh");
    this._originMesh = originMesh;
    this.object.position.copy(originMesh.position);
    originMesh.position.set(0, 0, 0);
    this._meshClone = originMesh.clone();
    this._meshClone.geometry = this._originMesh.geometry.clone();
    this._originMesh.geometry.computeBoundingBox();
    const position = this._meshClone.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      this._jv.push(new JellyVertex(i, vertex));
    }
  }
  updateVertex(): void {
    const originPosition = this._originMesh.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const newPosition = originPosition.clone();
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(this._originMesh);
    const boxSize = new THREE.Vector3();
    boundingBox.getSize(boxSize);
    boundingBox.applyMatrix4(this.object.matrixWorld);
    for (let i = 0; i < this._jv.length; i++) {
      const id = this._jv[i].id;
      const target = new THREE.Vector3().fromBufferAttribute(
        originPosition,
        id
      );
      const oldPoint = target.clone();
      this.object.localToWorld(target);

      const intensity =
        ((1 - (boundingBox.max.y - target.y)) /
          boundingBox.getSize(boxSize).y) *
        this.intensity;
      //if (i === 0) {
      //  console.log(boundingBox.min);
      //}
      this._jv[i].shake(target, this.mass, this.stiffness, this.damping);
      target.copy(this._jv[i].position);
      this.object.worldToLocal(target);
      const newPoint = oldPoint.lerp(target, intensity);
      newPosition.setXYZ(id, newPoint.x, newPoint.y, newPoint.z);
    }

    //console.log(this._jv[0].position);
    const geometry = this._meshClone.geometry;
    geometry.setAttribute("position", newPosition);
    //geometry.setFromPoints(newPoints);
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();
    return;
  }

  init(): Promise<void> {
    this.object.add(this._meshClone);
    this.mainScene.add(this.object);
    return;
  }
  update(deltaTime: number): void {
    this.updateVertex();
    //this.time += deltaTime;
    //this.object.position.setX(Math.sin(this.time));
  }
}
