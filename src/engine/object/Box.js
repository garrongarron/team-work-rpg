import * as THREE from 'three';

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const material = new THREE.MeshStandardMaterial({ color: 0x5F0A00 });

const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;

export default cube