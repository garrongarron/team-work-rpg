import textures from './TextureLoader.js';
import Terrain from './THREE.Terrain.js'
//MATERIAL
let blend = new Promise((resolve, reject) => {
    textures.then(t => {
        t[0].repeat.x = 100;
        t[0].repeat.y = 100
        t[1].repeat.x = 80;
        t[1].repeat.y = 80
        t[2].repeat.x = 100;
        t[2].repeat.y = 100
        t[3].repeat.x = 100;
        t[3].repeat.y = 100

        let blend = Terrain.generateBlendedMaterial([
            { texture: t[0] }, //arena 0
            { texture: t[1], levels: [1.5, 1.6, 20, 22] }, //original -80, -35, 20, 50 ///pasto
            { texture: t[2], levels: [10, 22, 25, 30] }, //1, 20, 60, 70// original 20, 50, 60, 85 //roca
            { texture: t[3], levels: [25, 30, 40, 100] }, //1, 20, 60, 70// original 20, 50, 60, 85 //nieve
            // { texture: t[3], glsl: '1.0 - smoothstep(25.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 35.0, vPosition.z)' },//nieve
            { texture: t[2], glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2' }, // between 27 and 45 degrees
            // { texture: t[4]}, // between 27 and 45 degrees
        ]);
        resolve(blend)
    })
})

export default blend