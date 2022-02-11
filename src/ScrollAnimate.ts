import ThreeBase from "./ThreeBase";
import type { BufferGeometry, PointsMaterial, Points } from "three";
import * as Three from "three";

class ScrollAnimate extends ThreeBase {
  constructor() {
    super();

    const cube = new Three.Mesh(
      new Three.BoxGeometry(1, 1, 1),
      new Three.MeshBasicMaterial({ color: "red" })
    );
    this.scene.add(cube);
  }
}

new ScrollAnimate();
