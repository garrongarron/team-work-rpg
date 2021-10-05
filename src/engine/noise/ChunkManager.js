import machine from "../basic/Machine.js"
import Chunk from "./Chunk.js"

class ChunkManager {
    constructor(scene, width, t) {
        this.chunks = new Map()
        this.scene = scene
        this.width = width
        this.prevPosition = { x: 0, y: 0 }
        this.createChunk(0, 0, t)

        this.character = null
        machine.addCallback(() => {
            if (this.character != null) {
                this.input(
                    this.character.position.x,
                    this.character.position.z,
                )
            }
        })

    }
    setScene(scene) {
        this.scene = scene
    }
    setCharacter(character) {
        this.character = character
    }

    input(x, y) {
        let _x = Math.round(x / this.width) * this.width
        let _y = Math.round(y / this.width) * this.width
        if (this.prevPosition.x == _x && this.prevPosition.y == _y)
            return
        this.prevPosition.x = _x
        this.prevPosition.y = _y
        this.update(_x, _y)
    }

    createChunk(x, y, t) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let offset = {
                    x: x + i * this.width,
                    y: y + j * this.width
                }
                let chunk = new Chunk(offset.x, offset.y, this.width, t)
                this.chunks.set(offset.x + ':' + offset.y, chunk)
                this.scene.add(chunk.getChunk())
            }
        }
    }

    update(x, y) {
        let indexes = this.getIndexes(x, y)
        for (let index = 0; index < indexes.outdated.length; index++) {
            const key = indexes.outdated[index];
            let chunk = this.chunks.get(key)
            let coordinates = indexes.toUpdate[index].split(':')
            let _x = coordinates[0] * 1
            let _y = coordinates[1] * 1
            chunk.update(_x, _y)
            this.chunks.set(_x + ':' + _y, chunk)
            this.chunks.delete(key)
        }
    }

    getIndexes(x, y) {
        let needed = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let offset = {
                    x: x + i * this.width,
                    y: y + j * this.width
                }
                let index = offset.x + ':' + offset.y
                needed.push(index)
            }
        }

        let outdated = []
        this.chunks.forEach((value, key, map) => {
            if (!needed.includes(key)) {
                outdated.push(key)
            }
        });

        let toUpdate = []
        needed.forEach(index => {
            if (!this.chunks.has(index)) {
                toUpdate.push(index)
            }
        });

        return {
            outdated,
            toUpdate
        }
    }
}

export default ChunkManager