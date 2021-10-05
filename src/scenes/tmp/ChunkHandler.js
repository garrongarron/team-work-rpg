import blend from "../engine/noise/Blend"
import ChunkManager from "../engine/noise/ChunkManager"
// import sphere from "../engine/object/Sphere"

class ChunkHandler {
    constructor() {
        blend.then(t => {
            // console.log(sphere);
            // this.chunkManager = new ChunkManager(sphere, 1000, t)
        })
    }
    setCharacter(mesh) {
        // this.chunkManager.setCharacter(mesh)
    }
    start() {

    }
    stop() {

    }
}
const chunkHandler = new ChunkManager()

export default chunkHandler