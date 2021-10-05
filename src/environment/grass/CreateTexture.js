import Heightfield from './Heightfield.js'
import { vec3 as Vec3 } from './Vec.js'
import createTexture from './TerraMap.js'
import config from './Config.js'
import { getAssets } from './Loader.js'


let terraMap
let heightMapScale

let getTexture = () => {
    let assets = getAssets()
    const hfCellSize = config.HEIGHTFIELD_SIZE / assets.images['heightmap'].width
    heightMapScale = Vec3.create(
        1.0 / config.HEIGHTFIELD_SIZE,
        1.0 / config.HEIGHTFIELD_SIZE,
        config.HEIGHTFIELD_HEIGHT
    )
    let heightField = Heightfield({
        cellSize: hfCellSize,
        minHeight: 0.0,
        maxHeight: heightMapScale.z,
        image: assets.images['heightmap']
    })

    terraMap = createTexture(heightField, config.LIGHT_DIR, assets.images['noise'])
    return terraMap
}
export default getTexture
export { heightMapScale }