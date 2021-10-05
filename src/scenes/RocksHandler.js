import perlin2 from "../engine/noise/PerlinHandler";
import someRocks from "../environment/rocks/SomeRocks";

class RocksHandler {
    constructor() {
        this.rocks = []
    }
    init(scene) {
        someRocks.getSome().then(arr => {
            arr.forEach(element => {
                arr.push(element.clone(true))
                for (let index = 0; index < 50; index++) {
                    arr.push(element.clone(true))
                }
            })
            arr.forEach((element, index) => {
                let coor = this.getRandomCordinates(250, 250)
                let x = -4 + coor.x
                let z = 26 + coor.z
                element.position.y = perlin2.Get(x, -z) - .1
                element.position.x = x
                element.position.z = z
                    // element.rotation.x = Math.PI * 2 * Math.random()
                    // element.rotation.z = Math.PI * 2 * Math.random()
                let s = element.scale.x * (.5 + Math.random() * 1)
                element.scale.set(s, s, s)
                scene.add(element)
                element.castShadow = true; //default is false
                element.receiveShadow = false; //default
            });
            arr.forEach((element, index) => {
                let coor = this.getRandomCordinates(250, 250)
                let x = -4 + coor.x
                let z = 26 + coor.z
                element.position.y = perlin2.Get(x, -z) - .1
                element.position.x = x
                element.position.z = z
                element.rotation.x = Math.PI * 2 * Math.random()
                element.rotation.z = Math.PI * 2 * Math.random()
                let s = element.scale.x * (.5 + Math.random() * 3)
                element.scale.set(s, s, s)
                scene.add(element)
                element.castShadow = true; //default is false
                element.receiveShadow = false; //default
            });

            this.rocks = arr.map(group => {
                return group.children[0]
            })
        })
    }
    getRocks() {
        return this.rocks
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