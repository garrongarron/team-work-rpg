import { TextureLoader } from 'three'
import grassFile from './textures/grass.jpg'
import heightmapFile from './textures/heightmap.jpg'
import noiseFile from './textures/noise.jpg'
import vertexFile from './shaders/grass.vert.glsl'
import fragFile from './shaders/grass.frag.glsl'

let assets = {
    textures: {
        grass: null
    },
    shaders: {
        vert: null,
        frag: null,
    },
    images: {
        heightmap: null
    }
}

let grass = () => {
    return new Promise((resolve, reject) => {
        new TextureLoader().load(grassFile, (t) => {
            assets.textures.grass = t
            resolve(true)
        }, undefined, (err) => { reject(err) })
    })
}

let FS = () => {
    return new Promise((resolve, reject) => {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", fragFile, false);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    assets.shaders.frag = rawFile.responseText
                    resolve(true)
                } else {
                    reject("???")
                }
            }
        }
        rawFile.send()
    })
}

let VS = () => {
    return new Promise((resolve, reject) => {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", vertexFile, false);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    assets.shaders.vert = rawFile.responseText
                    resolve(true)
                } else {
                    reject("???")
                }
            }
        }
        rawFile.send()
    })
}

let heightMap = () => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener('load', () => {
            assets.images.heightmap = img
            resolve(true);
        });
        img.addEventListener('error', () => {
            reject("???");
        });
        img.src = heightmapFile
    })
}


let noise = () => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener('load', () => {
            assets.images.noise = img
            resolve(true);
        });
        img.addEventListener('error', () => {
            reject("???");
        });
        img.src = noiseFile
    })
}

let assetsInPromise = new Promise((resolve, reject) => {

    Promise.all([grass(), FS(), VS(), heightMap(), noise()]).then(element => {
        // setTimeout(() => {
        resolve(assets)
            // }, 1000);
    })
})


let getAssets = () => {
    return assets
}
export default assetsInPromise
export { getAssets }