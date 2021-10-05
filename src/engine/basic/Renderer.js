import * as THREE from 'three';
import canvas from './Canvas.js'

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;
renderer.setClearColor(0x7EA3B2);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMappingExplosure = 8.3
export default renderer