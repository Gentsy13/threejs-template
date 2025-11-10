import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

let coin;

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load("assets/coin.mtl", (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load("assets/coin.obj", (root) => {
        coin = root;
        scene.add(root);
      });
    });

    mtlLoader.load("assets/stones.mtl", (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load("assets/stones.obj", (root) => {
        root.position.x = 2;
        scene.add(root);
      });
    });
  }
  const keys = {};
  window.addEventListener("keydown", (e) => (keys[e.code] = true));
  window.addEventListener("keyup", (e) => (keys[e.code] = false));
  function render(time) {
    if (keys["KeyW"]) coin.position.z -= 0.1;
    if (keys["KeyS"]) coin.position.z += 0.1;
    if (keys["KeyD"]) coin.position.x += 0.1;
    if (keys["KeyA"]) coin.position.x -= 0.1;
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
