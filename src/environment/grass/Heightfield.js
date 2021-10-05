import { vec3 as Vec3 } from './Vec.js'
import { pmod } from './Gmath.js'

let offset = { x: 0, y: 0 }

let Heightfield = (info) => {
    const hf = {
        cellSize: (info.cellSize && info.cellSize > 0) ? info.cellSize : 1.0,
        minHeight: (typeof info.minHeight === 'number') ? info.minHeight : 0.0,
        maxHeight: (typeof info.maxHeight === 'number') ? info.maxHeight : 1.0,
        xCount: 0, // remaining will be computed later
        yCount: 0,
        xSize: 0,
        ySize: 0,
        heights: new Float32Array(0),
        faceNormals: new Float32Array(0), // packed: [x0, y0, z0, x1, y1, z1]
        vtxNormals: new Float32Array(0)
    }

    if (info.image) {
        genFromImg(info.image, hf)
    } else {
        hf.xCount = info.xCount && info.xCount > 0 ? Math.floor(info.xCount) : 1
        hf.yCount = info.yCount && info.yCount > 0 ? Math.floor(info.yCount) : 1
        hf.xSize = hf.xCount * hf.cellSize
        hf.ySize = info.yCount * hf.cellSize
        hf.heights = info.heights || new Float32Array((hf.xCount + 1) * (hf.yCount + 1))
        // 2 normals per cell (quad)
        hf.faceNormals = new Float32Array(3 * 2 * hf.xCount * hf.yCount)
        hf.vtxNormals = new Float32Array(3 * (hf.xCount + 1) * (hf.yCount + 1))
        calcFaceNormals(hf)
    }
    return hf
}


function genFromImg(image, hf) {
    let x, y, i, height
    const w = image.width,
        h = image.height,
        heightRange = hf.maxHeight - hf.minHeight

    hf.xCount = w - 1
    hf.yCount = h - 1
    hf.xSize = hf.xCount * hf.cellSize
    hf.ySize = hf.yCount * hf.cellSize

    // Draw to a canvas so we can get the data
    let canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, w, h)
    // array of canvas pixel data [r,g,b,a, r,g,b,a, ...]
    let data = ctx.getImageData(0, 0, w, h).data
    const heights = new Float32Array(w * h)
    for (y = 0; y < h; ++y) {
        for (x = 0; x < w; ++x) {
            // flip vertical because textures are Y+
            i = (x + (h - y - 1) * w) * 4
            //i = (x + y * w) * 4

            // normalized altitude value (0-1)
            // assume image is grayscale, so we only need 1 color component
            // height = data[i] / 255.0
            
            //height = (data[i+0] + data[i+1] + data[i+2]) / (255+255+255)

            //  scale & store this altitude   
            heights[x + y * w] = 25
        }
    }
    // Free these resources soon as possible
    data = ctx = canvas = null

    hf.heights = heights

    // 2 normals per cell (quad)
    hf.faceNormals = new Float32Array(3 * 2 * hf.xCount * hf.yCount)
    hf.vtxNormals = new Float32Array(3 * (hf.xCount + 1) * (hf.yCount + 1))
    calcFaceNormals(hf)
    calcVertexNormals(hf)
}

function calcFaceNormals(hf) {
    const csz = hf.cellSize,
        xc = hf.xCount,        // tile X & Y counts
        yc = hf.yCount,
        hxc = hf.xCount + 1,     // height X count (1 larger than tile count)
        heights = hf.heights,  // 1 less indirection
        normals = hf.faceNormals,
        v0 = Vec3.create(),
        v1 = Vec3.create(),
        n = Vec3.create()  // used to compute normals
    let i = 0

    const tStart = Date.now()
    for (let iy = 0; iy < yc; ++iy) {
        for (let ix = 0; ix < xc; ++ix) {
            i = 6 * (ix + iy * xc)
            const ih = ix + iy * hxc
            const z = heights[ih]

            // 2 vectors of top-left tri
            v0.x = csz
            v0.y = csz
            v0.z = heights[ih + hxc + 1] - z

            v1.x = 0.0
            v1.y = csz
            v1.z = heights[ih + hxc] - z

            Vec3.cross(v0, v1, n)
            Vec3.normalize(n, n)
            normals[i + 0] = n.x
            normals[i + 1] = n.y
            normals[i + 2] = n.z

            // 2 vectors of bottom-right tri
            v0.x = csz
            v0.y = 0.0
            v0.z = heights[ih + 1] - z

            v1.x = csz
            v1.y = csz
            v1.z = heights[ih + hxc + 1] - z

            Vec3.cross(v0, v1, n)
            Vec3.normalize(n, n)
            normals[i + 3] = n.x
            normals[i + 4] = n.y
            normals[i + 5] = n.z
        }
    }
    const dt = Date.now() - tStart
    console.log(`computed ${i} heightfield face normals in ${dt}ms`)
}

function calcVertexNormals(hf) {
    const vnorms = hf.vtxNormals
    const w = hf.xCount + 1
    const h = hf.yCount + 1
    const n = Vec3.create()
    let i = 0
    const tStart = Date.now()
    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            computeVertexNormal(hf, x, y, n)
            i = (y * w + x) * 3
            vnorms[i++] = n.x
            vnorms[i++] = n.y
            vnorms[i++] = n.z
        }
    }
    const dt = Date.now() - tStart
    console.log(`computed ${w * h} vertex normals in ${dt}ms`)
}

function computeVertexNormal(hf, vx, vy, n) {
    const fnorms = hf.faceNormals
    // This vertex is belongs to 4 quads
    // Do the faces this vertex is the 1st point of for this quad.
    // This is the quad up and to the right
    let qx = vx % hf.xCount
    let qy = vy % hf.yCount
    let ni = (qy * hf.xCount + qx) * 3 * 2
    n.x = fnorms[ni + 0]
    n.y = fnorms[ni + 1]
    n.z = fnorms[ni + 2]
    ni += 3
    n.x += fnorms[ni + 0]
    n.y += fnorms[ni + 1]
    n.z += fnorms[ni + 2]

    // 2nd tri of quad up and to the left
    qx = pmod(qx - 1, hf.xCount)
    ni = (qy * hf.xCount + qx) * 3 * 2 + 3
    n.x += fnorms[ni + 0]
    n.y += fnorms[ni + 1]
    n.z += fnorms[ni + 2]

    // both tris of quad down and to the left
    qy = pmod(qy - 1, hf.yCount)
    ni = (qy * hf.xCount + qx) * 3 * 2
    n.x += fnorms[ni + 0]
    n.y += fnorms[ni + 1]
    n.z += fnorms[ni + 2]
    ni += 3
    n.x += fnorms[ni + 0]
    n.y += fnorms[ni + 1]
    n.z += fnorms[ni + 2]

    // 1st tri of quad down and to the right
    qx = (qx + 1) % hf.xCount
    ni = (qy * hf.xCount + qx) * 3 * 2
    n.x += fnorms[ni + 0]
    n.y += fnorms[ni + 1]
    n.z += fnorms[ni + 2]

    // Normalize to 'average' the result normal
    Vec3.normalize(n, n)
}

export default Heightfield