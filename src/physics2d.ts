import * as b2 from "@flyover/box2d";
import * as THREE from "three";

export class Physics2D {
  gravity: b2.Vec2 = new b2.Vec2(0, -9.8);
  world: b2.World = new b2.World(this.gravity);
  groundBody: b2.Body;
  static velocityIterations = 6;
  static positionIterations = 2;

  rigidBodies: THREE.Object3D[] = [];
  init(): void {
    const groundBodyDef: b2.BodyDef = new b2.BodyDef();
    groundBodyDef.position.Set(0, -10);
    this.groundBody = this.world.CreateBody(groundBodyDef);
    const groundBox: b2.PolygonShape = new b2.PolygonShape();
    groundBox.SetAsBox(50, 10);
    this.groundBody.CreateFixture(groundBox, 0);
  }
  createRigidBody(
    renderObject: THREE.Object3D,
    dynamicBox: b2.PolygonShape,
    type = 0,
    position: b2.Vec2,
    angle: number,
    density = 1,
    friction = 0.3
  ): void {
    const bodyDef: b2.BodyDef = new b2.BodyDef();
    bodyDef.type = type;
    bodyDef.position.Copy(position);
    bodyDef.angle = angle;
    const body: b2.Body = this.world.CreateBody(bodyDef);

    const fixtureDef: b2.FixtureDef = new b2.FixtureDef();
    fixtureDef.shape = dynamicBox;

    fixtureDef.density = density;
    fixtureDef.friction = friction;
    const fixture: b2.Fixture = body.CreateFixture(fixtureDef);

    renderObject.userData.physicsBody = body;
    renderObject.userData.fixture = fixture;
    this.rigidBodies.push(renderObject);
  }
  updatePhysics(deltaTime: number): void {
    this.world.Step(
      deltaTime,
      Physics2D.positionIterations,
      Physics2D.velocityIterations
    );
    // Update rigid bodies
    for (let i = 0, il = this.rigidBodies.length; i < il; i++) {
      const objThree = this.rigidBodies[i];
      const objPhys = objThree.userData.physicsBody as b2.Body;
      const position = objPhys.GetPosition();
      const angle = objPhys.GetAngle();
      objThree.position.set(position.x, position.y, 0);
      const euler = new THREE.Euler(0, angle, 0);
      objThree.quaternion.setFromEuler(euler);
    }
  }
}
