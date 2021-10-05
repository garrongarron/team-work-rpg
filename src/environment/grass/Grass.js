import camera from '../../engine/basic/Camera'
import assetsInPromise from "./Loader.js"
import machine from '../../engine/basic/Machine.js'
import GrassChunkManager from "./GrassChunkManager.js"
import config from "./Config.js"

let unit = config.GRASS_PATCH_RADIUS * 2
let grass = { chunkManager: null }
let paladin = null

let assetsReady = () => {
    return assetsInPromise
}

let grassRelocation = () => {
    let offset = {
        x: Math.round(paladin.position.x / unit) * unit,
        y: -Math.round(paladin.position.z / unit) * unit
    }
    grass.chunkManager.init(offset)
}
let addGrass = (scene, warrior) => {
    paladin = warrior
    assetsReady().then(() => {
        // getMaterial()
        grass.chunkManager = new GrassChunkManager(scene)

        machine.addCallback(grassRelocation)

    })
}
let dropGrass = () => {
    machine.removeCallback(grassRelocation)
    grass.chunkManager.close()
    grass.chunkManager = null
}
export default addGrass
export { dropGrass }