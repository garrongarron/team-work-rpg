import { getGeometry, initBladeOffsetVerts } from "./Geometry.js"
import { getMaterial } from "./Material.js"
import { Mesh } from 'three'
import config from "./Config.js"


class GrassChunkManager {
    constructor(scene) {
        this.scene = scene
        this.chunks = new Map()
        this.mainChunk = null
        this.prevOffset = { x: null, y: null }
        this.unit = config.GRASS_PATCH_RADIUS * 2
    }

    create(offset) {
        const grass = new Mesh(getGeometry(offset), getMaterial())
        grass.frustumCulled = false
        grass.renderOrder = 10
        grass.frustumCulled = false // always draw, never cull
        grass.rotation.x = -Math.PI / 2
        grass.name = "GRASS"
        grass.position.y -= .4
        return grass
    }
    getMainChunk() {
        return this.mainChunk
    }
    init(offset) {
        if (offset.x == this.prevOffset.x && offset.y == this.prevOffset.y) {
            return
        }

        if (this.prevOffset.x != null) {
            this.updateChunks(offset)
            return
        }
        this.prevOffset = offset

        // this.mainChunk = this.create(offset)
        // this.mainChunk.geometry.computeBoundingBox();
        // this.mainChunk.geometry.computeBoundingSphere();

        // this.scene.add(this.mainChunk);

        // circundant chunks
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let offset_i = {
                    x: offset.x + this.unit * i,
                    y: offset.y + this.unit * j
                }
                this.chunks.set(offset_i.x + ':' + offset_i.y, this.create(offset_i))
                this.scene.add(this.chunks.get(offset_i.x + ':' + offset_i.y));
            }
        }

    }
    updateChunks(offset) {
        // initBladeOffsetVerts(this.mainChunk.geometry.attributes.offset.array, offset)
        // this.mainChunk.geometry.attributes.offset.needsUpdate = true;
        // this.mainChunk.geometry.computeBoundingBox();
        // this.mainChunk.geometry.computeBoundingSphere();
        // this.mainChunk.material.needsUpdate = true

        let newone = []
        let needed = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let offset_i = {
                        x: offset.x + this.unit * i,
                        y: offset.y + this.unit * j
                    }
                    //todos los que necesito
                needed.push(offset_i.x + ':' + offset_i.y)
                    //los nuevos que no estan
                if (!this.chunks.has(offset_i.x + ':' + offset_i.y)) {
                    newone.push(offset_i)
                }
            }
        }
        //los que me sobran
        let outOfDate = []
        this.chunks.forEach((chunk, value) => {
            if (!needed.includes(value)) {
                outOfDate.push(value)
            }
        })

        while (outOfDate.length != 0) {
            // console.log('outOfDate XD');
            let old = outOfDate.shift()
            let tmpChunk = this.chunks.get(old)
            this.chunks.delete(old) //delete from MAP object
            let offset = newone.shift()
            initBladeOffsetVerts(tmpChunk.geometry.attributes.offset.array, offset)
            tmpChunk.geometry.attributes.offset.needsUpdate = true;
            tmpChunk.geometry.computeBoundingBox();
            tmpChunk.geometry.computeBoundingSphere();
            tmpChunk.material.needsUpdate = true
            this.chunks.set(offset.x + ':' + offset.y, tmpChunk)
        }
        this.prevOffset = offset
    }
    close() {
        this.chunks.forEach(element => {
            this.scene.remove(element)
            console.log('removing grass from scene');
        });
        this.chunks = new Map()
        this.prevOffset = { x: null, y: null }
    }
}

export default GrassChunkManager