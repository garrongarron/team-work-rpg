import config from './Config.js'
import { vec3 as Vec3, color as Color, vec2 as Vec2 } from './Vec.js'
import getTexture, { heightMapScale } from './CreateTexture.js'////
import { getAssets } from './Loader.js'
import * as THREE from 'three'

let getMaterial = () => {
    const terraMap = getTexture()
    let assets = getAssets()
    
    let windIntensity = config.WIND_DEFAULT

    let opts = {
        lightDir: config.LIGHT_DIR,
        // numBlades: config.NUM_GRASS_BLADES,
        radius: config.GRASS_PATCH_RADIUS,
        texture: assets.textures['grass'],
        vertScript: assets.shaders['vert'],
        fragScript: assets.shaders['frag'],
        heightMap: terraMap,
        heightMapScale,
        fogColor: config.FOG_COLOR,
        fogFar: config.GRASS_PATCH_RADIUS * 20, //fogDist, // 2000
        grassFogFar: config.GRASS_PATCH_RADIUS * 3, //, //grassFogDist, // 170
        grassColor: config.GRASS_COLOR,
        transitionLow: config.BEACH_TRANSITION_LOW,
        transitionHigh: config.BEACH_TRANSITION_HIGH,
        windIntensity
    }
    const tex = opts.texture
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    const htex = opts.heightMap
    htex.wrapS = htex.wrapT = THREE.RepeatWrapping
    const lightDir = Vec3.clone(opts.lightDir)
    const hscale = opts.heightMapScale

    const vertScript = opts.vertScript.replace(
        '%%BLADE_HEIGHT_TALL%%', (config.BLADE_HEIGHT_MAX ).toFixed(1)
    ).replace(
        '%%BLADE_SEGS%%', config.BLADE_SEGS.toFixed(1)
    ).replace(
        '%%PATCH_SIZE%%', (opts.radius * 2.0).toFixed(1)
    ).replace(
        '%%TRANSITION_LOW%%', opts.transitionLow.toString()
    ).replace(
        '%%TRANSITION_HIGH%%', opts.transitionHigh.toString()
    )




    const material = new THREE.RawShaderMaterial({
        uniforms: {
            lightDir: { type: '3f', value: Vec3.toArray(lightDir) },
            time: { type: 'f', value: 0.0 },
            map: { type: 't', value: tex },
            heightMap: { type: 't', value: htex },
            heightMapScale: { type: '3f', value: [hscale.x, hscale.y, hscale.z] },
            camDir: { type: '3f', value: [1.0, 0.0, 0.0] },
            drawPos: { type: '2f', value: Vec2.toArray(config.DRAW_POSITION) },//[100.0, 0.0] 
            fogColor: { type: '3f', value: Color.toArray(opts.fogColor) },// Color.toArray(opts.fogColor)
            fogNear: { type: 'f', value: 1.0 },
            fogFar: { type: 'f', value: opts.fogFar },//
            grassColor: { type: '3f', value: Color.toArray(opts.grassColor) },
            grassFogFar: { type: 'f', value: opts.grassFogFar },//
            windIntensity: { type: 'f', value: opts.windIntensity / 2 }
        },
        vertexShader: vertScript,
        fragmentShader: opts.fragScript,
        transparent: true
    })
    return material
}

export { getMaterial }
