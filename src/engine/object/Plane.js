import { Mesh, MeshBasicMaterial, PlaneGeometry, ImageUtils, RepeatWrapping, MeshLambertMaterial } from 'three'
const geometry = new PlaneGeometry(100, 100);
// const material = new MeshBasicMaterial({
//     color: 0xffff00,
//     // side: THREE.DoubleSide
// });


let texture = ImageUtils.loadTexture("../src/images/grass.jpg");
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.repeat.set(4, 4);

let material = new MeshLambertMaterial({ map: texture });
const plane = new Mesh(geometry, material);
plane.rotation
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true;

export default plane