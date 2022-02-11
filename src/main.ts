import * as Three from "Three";
import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";
class ScrollAnimate {
  container: HTMLElement;
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  textureLoader;
  // 每个物体的间距 4个单位
  objectsDistance = 4;
  // 物体数组
  sectionMeshes = [];
  constructor(targetClassName = "canvas.webgl") {
    this.container = document.querySelector(targetClassName);
    this.init();

    this.setObject();
  }
  setObject() {
    // 材质
    const textureLoader = new Three.TextureLoader();
    const gradientTexture = textureLoader.load(
      "static/textures/gradients/3.jpg"
    );
    gradientTexture.magFilter = Three.NearestFilter;

    // Material
    const material = new Three.MeshToonMaterial({
      color: "#ffeded",
      gradientMap: gradientTexture,
    });
    const mesh1 = new Three.Mesh(
      new Three.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new Three.Mesh(new Three.ConeGeometry(1, 2, 32), material);
    const mesh3 = new Three.Mesh(
      new Three.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );

    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    mesh1.position.y = -this.objectsDistance * 0;
    mesh2.position.y = -this.objectsDistance * 1;
    mesh3.position.y = -this.objectsDistance * 2;

    this.scene.add(mesh1, mesh2, mesh3);

    this.sectionMeshes = [mesh1, mesh2, mesh3];

    // 环境光
    const directionalLight = new Three.DirectionalLight("#ffffff", 1);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);
  }
  private init() {
    // 初始化场景
    this.scene = new Three.Scene();
    // 相机
    this.setCamera();
    // 渲染器
    this.setRenderer();
    // 动画相关
    this.setAnimate();
    // 响应式
    this.setResponsive();
  }
  setCamera() {
    const camera = new Three.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    camera.position.z = 6;
    this.scene.add(camera);
    this.camera = camera;
  }
  setRenderer() {
    const renderer = new Three.WebGLRenderer({
      canvas: this.container,
    });
    renderer.setSize(this.sizes.width, this.sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer = renderer;
  }
  setAnimate() {
    const clock = new Three.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // 相机随着滚动而移动
      this.camera.position.y =
        (-scrollY / this.sizes.height) * this.objectsDistance;

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };
    tick();
  }
  setResponsive() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
}
new ScrollAnimate();
