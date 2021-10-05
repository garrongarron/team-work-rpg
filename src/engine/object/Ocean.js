import * as THREE from 'three';

const boxWidth = 1000;
const boxHeight = .1;
const boxDepth = 1000;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const material = new THREE.MeshStandardMaterial({ color: 0x336BFF });

const ocean = new THREE.Mesh(geometry, material);
ocean.position.y = -.05
ocean.castShadow = true;
ocean.receiveShadow = true;
ocean.name = 'ocean'

export default ocean