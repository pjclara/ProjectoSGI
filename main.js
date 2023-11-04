import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js";
import { LoopOnce } from "three";

const dogUrl = new URL("vintageDesk.gltf", import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const spaceTexture = new THREE.TextureLoader().load('bg.jpeg');
scene.background = spaceTexture;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

renderer.setClearColor(0xa3a3a3);

const controls = new OrbitControls(camera, renderer.domElement);

controls.minPolarAngle = Math.PI/3;
controls.maxPolarAngle = Math.PI/2;

//controls.autoRotate = true;
controls.autoRotateSpeed = 2;

camera.position.set(0, 1, 2);
camera.lookAt(0,0,0);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1.5);
scene.add(light);

// loading the model
const loadingManager = new THREE.LoadingManager();

const progressingBarContainer = document.querySelector(".progressive-bar-container");
loadingManager.onLoad = () => {
  progressingBarContainer.style.display = "none";
}

const progressingBar = document.getElementById("progressive-bar");

loadingManager.onProgress = (url, loaded, total) => {
  progressingBar.value = (loaded / total) * 100;
}

loadingManager.onError = () => {
  console.log("loading error");
} 

const assetLoader = new GLTFLoader(loadingManager);

let btn_gaveta_left_abrir = document.getElementById("btn_gaveta_left_abrir");
let btn_gaveta_left_fechar = document.getElementById("btn_gaveta_left_fechar");
let btn_gaveta_right = document.getElementById("btn_gaveta_right_abrir");

let mixer;
assetLoader.load(
  dogUrl.href,
  (gltf) => {
    scene.add(gltf.scene);
    mixer = new THREE.AnimationMixer(gltf.scene);
    let clips = gltf.animations;
    let clip_gaveta_left = THREE.AnimationClip.findByName(clips, "Gaveta_LAction");
    let action_gaveta_left  = mixer.clipAction(clip_gaveta_left );

    btn_gaveta_left_abrir.addEventListener("click", () => {
      action_gaveta_left.timeScale = 1;
      action_gaveta_left.setLoop(LoopOnce);
      action_gaveta_left.clampWhenFinished = true;
      action_gaveta_left.play();
    });
    btn_gaveta_left_fechar.addEventListener("click", () => {
      action_gaveta_left.timeScale = -action_gaveta_left.timeScale;
      action_gaveta_left.setLoop(LoopOnce);

      action_gaveta_left.play();
    });
  },
 
);

const clock = new THREE.Clock();
function animate() {
  if (mixer) mixer.update(clock.getDelta());
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
