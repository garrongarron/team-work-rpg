import params from "./PerlinCofig.js"
import perlin from './perlin.js';
import { Vector2, MathUtils } from 'three'
class Perlin {
    constructor(params) {
        this.params = params
        this.collection = []
        let data = {
            planeRadio: 70,
            gradient: 20,
            height: 10,
            x: 24,
            z: -20
        }
        let data2 = {
            planeRadio: 70,
            gradient: 20,
            height: 0,
            x: 24,
            z: -20 - 70 * 2
        }
        this.addPoint(data)
        this.addPoint(data2)
    }
    noise2D(x, y) {
        return perlin(x, y) * 2.0 - 1.0;
    }
    addPoint(data) {
        this.collection.push(data)
    }
    getHeight(x, z, y, data) {
        let coor1 = new Vector2(x, z)
        const b = new Vector2(data.x, data.z);
        let y1 = coor1.distanceTo(b)
        if (y1 < data.planeRadio) {
            return data.height
        }
        if (y1 < data.planeRadio + data.gradient) {
            return MathUtils.lerp(data.height, y, (y1 - data.planeRadio) / data.gradient)
        }
        return y
    }
    Get(x, y) {
        const xs = x / this.params.scale;
        const ys = y / this.params.scale;
        let amplitude = 1;
        let frequency = 1;
        let normalization = 0;
        let total = 0;

        for (let o = 0; o < this.params.octaves; o++) {
            const noiseValue = this.noise2D(xs * frequency, ys * frequency) * 0.5 + 0.5;

            total += noiseValue * amplitude;
            normalization += amplitude;
            amplitude *= this.params.persistence;
            frequency *= this.params.lacunarity;

        }
        total /= normalization;

        let out = Math.pow(total, this.params.exponentiation) * this.params.height
        out = this.process(x, y, out)
        return out;
    }
    process(x, y, out) {
        let out2 = out
        this.collection.map(data => {
            out2 = this.getHeight(x, y, out2, data)
        })
        return out2
    }
}
let perlin2 = new Perlin(params)
export default perlin2