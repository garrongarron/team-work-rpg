import { PlaneGeometry, Mesh } from 'three';
// import getBlend from './Blend.js';
import perlin from './PerlinHandler.js';

class Chunk {
    constructor(x, y, width, t) {
        this.node = {
            x: null,
            y: null
        }
        this.chunk = null
        this.width = width
        this.perlin = perlin
        this.create(x, y, t)
    }

    create(x, y, t) {
        this.node.x = x
        this.node.y = y
            //TODO
        const geometry = new PlaneGeometry(this.width, this.width, 100, 100); //TODO

        // let material = new THREE.MeshBasicMaterial({ color: '#'+Math.random().toString().substring(2,8) });//TODO
        this.chunk = new Mesh(geometry, t);
        this.chunk.rotation.x = -Math.PI / 2
        this.chunk.receiveShadow = true;
        this.update(this.node.x, this.node.y)
    }

    getChunk() {
        return this.chunk
    }
    update(x, y) {
        this.chunk.position.x = x
        this.chunk.position.z = y
        this.modifyVerticalPosition(x, y, this.chunk)
    }
    modifyVerticalPosition(x, y, plane) {
        let v = plane.geometry.attributes.position.array
        let nnn = v.length / 3
        for (let index = 0; index < nnn; index++) {
            v[index * 3 + 2] = this.perlin.Get(v[index * 3 + 0] + x, v[index * 3 + 1] - y)
        }
        plane.geometry.verticesNeedUpdate = true;
        plane.geometry.normalsNeedUpdate = true;
        plane.geometry.computeVertexNormals();
        plane.geometry.computeFaceNormals();
        plane.geometry.normalizeNormals();
        plane.matrixAutoUpdate = true;
        plane.updateMatrix();
        plane.geometry.attributes.position.needsUpdate = true;
        plane.geometry.dynamic = true;
    }
}

export default Chunk