import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const container = document.getElementById("cartucho-3d-viewer");

if (container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.2, 5.8);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
  mainLight.position.set(3.5, 4.5, 5.5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x88bbff, 1.2);
  fillLight.position.set(-4, 1.5, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xa78bfa, 1.1);
  rimLight.position.set(-2, -2, -4);
  scene.add(rimLight);

  let model = null;
  let baseScale = 1;
  let targetRotationY = -0.55;
  let targetRotationX = 0.18;
  let currentProject = "fluxy";

  const projectStyles = {
    fluxy: {
      rotationY: -0.55,
      rotationX: 0.18,
      positionY: 0.0,
      scale: 1
    },
    store: {
      rotationY: -0.3,
      rotationX: 0.12,
      positionY: -0.02,
      scale: 0.98
    },
    landing: {
      rotationY: -0.7,
      rotationX: 0.15,
      positionY: 0.01,
      scale: 0.99
    }
  };

  function fitModelToView(modelRoot) {
    const box = new THREE.Box3().setFromObject(modelRoot);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(maxDim) || maxDim <= 0) {
      return false;
    }

    modelRoot.position.sub(center);
    baseScale = 2.4 / maxDim;
    return true;
  }

  function showError(message) {
    container.innerHTML = `
      <div style="
        width:100%;
        height:100%;
        min-height:360px;
        display:flex;
        align-items:center;
        justify-content:center;
        text-align:center;
        padding:24px;
        color:#ffffff;
        font-family:Inter, sans-serif;
        background:linear-gradient(180deg,#10131a 0%, #080a0f 100%);
        border-radius:24px;
      ">
        <div>
          <strong style="display:block; margin-bottom:10px;">Erro ao carregar o cartucho 3D</strong>
          <span style="color:#a8b0bf;">${message}</span>
        </div>
      </div>
    `;
  }

  const loader = new GLTFLoader();

  loader.load(
    "assets/models/floppy_disk.glb",
    (gltf) => {
      model = gltf.scene;

      model.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.needsUpdate = true;
        }
      });

      const fitted = fitModelToView(model);
      if (!fitted) {
        console.warn("Não foi possível calcular o tamanho do modelo 3D.");
      }

      model.scale.setScalar(baseScale * projectStyles[currentProject].scale);
      model.position.set(0, projectStyles[currentProject].positionY, 0);
      model.rotation.set(
        projectStyles[currentProject].rotationX,
        projectStyles[currentProject].rotationY,
        0
      );

      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("Erro ao carregar o modelo 3D:", error);

      if (window.location.protocol === "file:") {
        showError("Abra o projeto com um servidor local (ex: Live Server), não via arquivo local file://.");
        return;
      }

      showError('Confira se o arquivo "floppy_disk.glb" está em assets/models/ e recarregue com Ctrl + F5.');
    }
  );

  const mouse = { x: 0, y: 0 };

  container.addEventListener("mousemove", (event) => {
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    mouse.x = (x - 0.5) * 0.35;
    mouse.y = (y - 0.5) * 0.2;
  });

  container.addEventListener("mouseleave", () => {
    mouse.x = 0;
    mouse.y = 0;
  });

  window.addEventListener("projectchange", (event) => {
    const projectKey = event.detail.projectKey;
    const style = projectStyles[projectKey];

    if (!style || !model) return;

    currentProject = projectKey;
    targetRotationY = style.rotationY;
    targetRotationX = style.rotationX;
    model.position.y = style.positionY;
    model.scale.setScalar(baseScale * style.scale);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    if (model) {
      model.rotation.y += ((targetRotationY + mouse.x) - model.rotation.y) * 0.06;
      model.rotation.x += ((targetRotationX + mouse.y) - model.rotation.x) * 0.06;
      model.position.y += (
        (projectStyles[currentProject].positionY + Math.sin(elapsed * 1.6) * 0.05) - model.position.y
      ) * 0.06;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
