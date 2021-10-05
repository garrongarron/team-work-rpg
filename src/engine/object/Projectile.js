import { MeshStandardMaterial, Mesh, BoxGeometry, SphereGeometry } from 'three';
let projectile = new Mesh(
    new BoxGeometry(.05, .05, 2),
    new MeshStandardMaterial({
        color: 0x6666ff,
    }));
let s = 1 / 2
projectile.scale.set(s, s, s)
projectile.position.set(0, 1, 0);
projectile.castShadow = true;
projectile.receiveShadow = true;
projectile.name = 'projectile'
projectile.material.emissive.setHex(Number(0xff0000))


// let cubeContainer = new Box3();
// cubeContainer.setFromObject(projectile);

const sphereGeometry = new SphereGeometry(.1, 32, 32);
const sphereMaterial = new MeshStandardMaterial({ color: 0xff0000 });
const sphere = new Mesh(sphereGeometry, sphereMaterial);
projectile.add(sphere)

export default projectile
// export { cubeContainer }