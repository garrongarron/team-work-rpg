import noise from './NoiseMaker.js'

let params = {
    noiseType: 'perlin',
    scale: 100,
    octaves: 1,
    persistence: .22,
    lacunarity: 4.9,//6.9,
    exponentiation: 5.8,
    seed: 1,
    height: 150
  }
let gen = new noise.Noise(params)

let getCustomNoise = ()=>{
    return gen
}
export default getCustomNoise