import perlin2 from "../engine/noise/PerlinHandler";
import someCastels from "../environment/buildings/SomeCastels";

class RocksHandler {
    constructor() {

    }
    init(scene) {
        someCastels.getSome().then(arr => {
            arr.forEach((element, index) => {
                let coor = this.getRandomCordinates(250, 250)
                let x = -4 + coor.x
                let z = 26 + coor.z
                element.position.y = perlin2.Get(x, -z) + 5
                element.position.x = x
                element.position.z = z

                element.position.x = 26.104468299678427
                element.position.y = -0.11469305079675784
                element.position.z = 41.5058526241698
                scene.add(element)
                element.castShadow = true; //default is false
                element.receiveShadow = false; //default
            });
        })
    }
    start(scene) {
        this.init(scene)
    }
    getRandomCordinates(x, z) {
        return {
            x: Math.random() * x - x / 2,
            z: Math.random() * z - z / 2
        }
    }
    stop() {

    }
}

const rocksHandler = new RocksHandler()

export default rocksHandler