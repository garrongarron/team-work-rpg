import ParticleSystem from './ParticleSystem.js'

import { getDelta } from '../../../engine/basic/Clock'
import { Color, Vector3 } from 'three'
import { NormalBlending, AdditiveBlending } from 'three'
import machine from '../../../engine/basic/Machine.js'

let textureArr = [
    'smokeparticle',
    'fire'
]
let blendingArr = [
    NormalBlending,
    AdditiveBlending
]
let params1 = {
    parent: null,
    life: 1,
    pointMultiplier: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0)) / 2, //15,
    quantity: 50,
    texture: textureArr[1],
    blending: blendingArr[0],
    velocity: new Vector3(0, 5, 0),
    colors: [new Color(0xFFFF80), new Color(0xFF8080)]
}
let params2 = {
    parent: null,
    life: 3,
    pointMultiplier: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0)) / 3, //280 *15,
    quantity: 15,
    texture: textureArr[0],
    blending: blendingArr[0],
    velocity: new Vector3(0, 5, 0),
    colors: [new Color(0x000000), new Color(0xcccccc)]
}
let setFire = (scene, flag) => {
    let ps
    let params = params1
    if (flag) {
        params = params2
    }

    params.parent = scene
    ps = new ParticleSystem(params);
    machine.addCallback(() => {
        if (ps) {
            ps.Step(getDelta());
        }
    })
    setTimeout(() => {
        ps.off()
    }, 1000 * 10);
    return ps._points
}




export default setFire