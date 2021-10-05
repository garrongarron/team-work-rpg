import { Mesh, SphereGeometry, MeshStandardMaterial } from 'three'

const bullet = new Mesh(
    new SphereGeometry(.05, 32, 32),
    new MeshStandardMaterial({
        color: 0x660000,
    }));
bullet.material.opacity = .91
bullet.material.transparent = true

export default bullet