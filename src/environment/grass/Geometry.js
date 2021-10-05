import config from './Config.js'
import { nrand } from './Gmath.js'
import noiseGenerator from './Simplex.js'
import { InstancedBufferGeometry, Sphere, Vector3, BufferAttribute, InstancedBufferAttribute } from 'three'
import perlin from '../../engine/noise/PerlinHandler';

let opts = {
    numBlades: config.NUM_GRASS_BLADES,
    radius: config.GRASS_PATCH_RADIUS,
}
let getGeometry = (offsetWorld) => {
    const buffers = {
        // Tells the shader which vertex of the blade its working on.
        // Rather than supplying positions, they are computed from this vindex.
        vindex: new Float32Array(config.BLADE_VERTS * 2 * 1),
        // Shape properties of all blades
        shape: new Float32Array(4 * opts.numBlades),
        // Positon & rotation of all blades
        offset: new Float32Array(4 * opts.numBlades),
        // Indices for a blade
        index: new Uint16Array(config.BLADE_INDICES)
    }
    initBladeIndices(buffers.index, 0, config.BLADE_VERTS, 0)
    initBladeOffsetVerts(buffers.offset, offsetWorld)
    initBladeShapeVerts(buffers.shape, opts.numBlades, buffers.offset)
    initBladeIndexVerts(buffers.vindex)


    const geometry = new InstancedBufferGeometry()
    geometry.boundingSphere = new Sphere(
        new Vector3(0, 0, 0), Math.sqrt(opts.radius * opts.radius * 2.0) * 10000.0
    )
    geometry.addAttribute('vindex', new BufferAttribute(buffers.vindex, 1))
    geometry.addAttribute('shape', new InstancedBufferAttribute(buffers.shape, 4))
    geometry.addAttribute('offset', new InstancedBufferAttribute(buffers.offset, 4))
    geometry.setIndex(new BufferAttribute(buffers.index, 1))
    return geometry
}

function initBladeIndexVerts(vindex) {
    for (let i = 0; i < vindex.length; ++i) {
        vindex[i] = i
    }
}

function initBladeShapeVerts(shape, numBlades, offset) {
    let noise = 0
    for (let i = 0; i < numBlades; ++i) {
        noise = Math.abs(noiseGenerator.simplex(
            offset[i * 4 + 0] * 0.03,
            offset[i * 4 + 1] * 0.03
        ))
        noise = noise * noise * noise
        noise *= 5.0
        noise = 0.0
        shape[i * 4 + 0] = config.BLADE_WIDTH + Math.random() * config.BLADE_WIDTH * 0.5 // width
        shape[i * 4 + 1] = config.BLADE_HEIGHT_MIN + Math.pow(Math.random(), 4.0) * (config.BLADE_HEIGHT_MAX - config.BLADE_HEIGHT_MIN) + noise // height
        shape[i * 4 + 2] = 0.0 + Math.random() * 0.3 // lean
        shape[i * 4 + 3] = 0.05 + Math.random() * 0.3 // curve
    }
}

function initBladeOffsetVerts(offset, offsetWorld) {
    for (let i = 0; i < opts.numBlades; ++i) {
        offset[i * 4 + 0] = nrand() * opts.radius + offsetWorld.x // x
        offset[i * 4 + 1] = nrand() * opts.radius + offsetWorld.y // y
        offset[i * 4 + 2] = perlin.Get(offset[i * 4 + 0], offset[i * 4 + 1]); // // z 
        offset[i * 4 + 3] = Math.PI * 2.0 * Math.random() // rot
    }
}

function initBladeIndices(id, vc1, vc2, i) {
    let seg
        // blade front side
    for (seg = 0; seg < config.BLADE_SEGS; ++seg) {
        id[i++] = vc1 + 0 // tri 1
        id[i++] = vc1 + 1
        id[i++] = vc1 + 2
        id[i++] = vc1 + 2 // tri 2
        id[i++] = vc1 + 1
        id[i++] = vc1 + 3
        vc1 += 2
    }
    // blade back side
    for (seg = 0; seg < config.BLADE_SEGS; ++seg) {
        id[i++] = vc2 + 2 // tri 1
        id[i++] = vc2 + 1
        id[i++] = vc2 + 0
        id[i++] = vc2 + 3 // tri 2
        id[i++] = vc2 + 1
        id[i++] = vc2 + 2
        vc2 += 2
    }
}

export { getGeometry, initBladeOffsetVerts }