import * as Three from "Three";
import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import gsap from "gsap";
class ScrollAnimate {
  container: HTMLElement;
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  cameraGroup;
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  textureLoader;
  // 每个物体的间距 4个单位
  objectsDistance = 4;
  // 物体数组
  sectionMeshes = [];
  cursor = {
    x: 0,
    y: 0,
  };
  constructor(targetClassName = "canvas.webgl") {
    this.container = document.querySelector(targetClassName);
    this.init();

    this.setObject();
    this.setCursor();
    this.setObjectRotate();
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
  setObjectRotate() {
    let scrollY = window.scrollY;
    let currentSection = 0;

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
      const newSection = Math.round(scrollY / this.sizes.height);

      if (newSection != currentSection) {
        currentSection = newSection;

        gsap.to(this.sectionMeshes[currentSection].rotation, {
          duration: 1.5,
          ease: "power2.inOut",
          x: "+=6",
          y: "+=3",
          z: "+=1.5",
        });
      }
    });
  }
  setCursor() {
    window.addEventListener("mousemove", (event) => {
      this.cursor.x = event.clientX / this.sizes.width - 0.5;
      this.cursor.y = event.clientY / this.sizes.height - 0.5;
    });
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
    // 相机组
    this.cameraGroup = new Three.Group();
    this.scene.add(this.cameraGroup);
    // 相机
    this.camera = new Three.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.z = 6;

    this.cameraGroup.add(this.camera);
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
    let previousTime = 0;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      // 相机随着滚动而移动
      this.camera.position.y =
        (-scrollY / this.sizes.height) * this.objectsDistance;

      // 鼠标移动相机
      const parallaxX = this.cursor.x * 0.5;
      const parallaxY = -this.cursor.y * 0.5;

      this.cameraGroup.position.x +=
        (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime;
      this.cameraGroup.position.y +=
        (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime;

      // 物体缓慢转动
      for (const mesh of this.sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
      }

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
