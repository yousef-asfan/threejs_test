import './style.css'
import * as THREE from 'three';
import { TextureLoader } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

/**
 * INIT
 * 
 */

// Scene
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height)
camera.position.z = 5;
camera.position.y = 8;
scene.add(camera);

const gridHelper = new THREE.GridHelper(20,20);
scene.add(gridHelper);

// Sizes
window.addEventListener('resize', () =>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
});

const controls = new OrbitControls(camera, canvas);
controls.enabled = true; 
controls.enableDamping = true;
controls.dampingFactor = 0.1;

/**
 * SCENE
 * 
 */
//Lights
var textureScale = 4;
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.castShadow = true;

dirLight.shadow.mapSize.set(1024 * textureScale, 1024 * textureScale);
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.camera.left = -10;

dirLight.castShadow = true;
dirLight.shadow.normalBias = 0.005;

dirLight.position.set(4, 2, 1);
scene.add(dirLight);

const ambiantLight = new THREE.AmbientLight(0xb9d5ff, 1);
scene.add(ambiantLight);

//Enviroment

const textureLoader = new TextureLoader();
const matcapTexture = textureLoader.load('./matcaps/4.png');
const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshMatcapMaterial({matcap: matcapTexture})
);
sphereMesh.position.set(0, 2, -4);
scene.add(sphereMesh);

/**
 *  --------------- FBX Loader ---------------
 */
const fbxLoader = new FBXLoader();
fbxLoader.load('./models/Teapot.fbx', (object)=>{
    object.traverse((child)=>{
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    object.scale.set(0.5,0.5,0.5);
    object.position.set(-2,0,0);
    scene.add(object);
},
(xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
},
(error) => {
    console.log(error)
})
const fontloader = new FontLoader();
fontloader.load('./fonts/helvetiker_bold.typeface.json', function (response){
    const textGeometry = new TextGeometry(
        'FBX Teapot',
        {
            font: response,
            size: 0.25,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5
        }
    );
    textGeometry.center();
    const textMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-2, 2, 0);
    scene.add(textMesh);
});

/**
 *  --------------- OBJ Loader ---------------
 */
const objLoader = new OBJLoader();
objLoader.load('./models/Teapot.obj', function (object) {
    object.traverse((child)=>{
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    object.scale.set(48.5,48.5,48.5);
    object.position.set(2,0,0);
    scene.add(object);
});
fontloader.load('./fonts/helvetiker_bold.typeface.json', function (response){
    const textGeometry = new TextGeometry(
        'obj Teapot',
        {
            font: response,
            size: 0.25,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5
        }
    );
    textGeometry.center();
    const textMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(2, 2, 0);
    scene.add(textMesh);
});

/**
 *  --------------- glTF Loader ---------------
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./node_modules/three/examples/js/libs/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('./models/Teapot.gltf', function(object){
    object.scene.position.set(2,3,0);
    object.scene.scale.set(0.485,0.485,0.485)
    scene.add(object.scene);
});
fontloader.load('./fonts/helvetiker_bold.typeface.json', function (response){
    const textGeometry = new TextGeometry(
        'glTF Teapot',
        {
            font: response,
            size: 0.25,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5
        }
    );
    textGeometry.center();
    const textMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(2, 5, 0);
    scene.add(textMesh);
});

/**
 *  --------------- glb Loader ---------------
 */
 gltfLoader.load('./models/Teapot.glb', function(object){
     object.scene.position.set(-2,3,0);
     object.scene.scale.set(0.485,0.485,0.485)
     scene.add(object.scene);
 });
 fontloader.load('./fonts/helvetiker_bold.typeface.json', function (response){
     const textGeometry = new TextGeometry(
         'glb Teapot',
         {
             font: response,
             size: 0.25,
             height: 0.01,
             curveSegments: 12,
             bevelEnabled: true,
             bevelThickness: 0.03,
             bevelSize: 0.01,
             bevelOffset: 0,
             bevelSegments: 5
         }
     );
     textGeometry.center();
     const textMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
     const textMesh = new THREE.Mesh(textGeometry, textMaterial);
     textMesh.position.set(-2, 5, 0);
     scene.add(textMesh);
 });


/**
 * TICK
 * 
 */
const clock = new THREE.Clock();
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();