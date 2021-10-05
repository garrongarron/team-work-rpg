import sphere from "../engine/object/Sphere";
import someCastels from "../environment/buildings/SomeCastels";
import cube from '../engine/object/Box'
class CastleHandler {
    constructor() {
        this.castle = null
    }
    init(scene) {
        someCastels.getSome().then(arr => {
            arr.forEach((element, index) => {
                element.name = 'castle'
                this.castle = element
                element.position.x = 26.104468299678427
                element.position.y = 10
                element.position.z = 41.5058526241698
                scene.add(element)
                sphere.attach(element)
                element.castShadow = true; //default is false
                element.receiveShadow = false; //default
                console.log(element);
                let c1 = cube.clone()
                scene.add(c1)

                c1.position.x = -1.83
                c1.position.y = 21.5
                c1.position.z = 38.32

            });
        })
    }
    getCastle() {
        return this.castle
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

const castleHandler = new CastleHandler()

export default castleHandler