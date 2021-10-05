import machine from "../engine/basic/Machine";
import perlin2 from "../engine/noise/PerlinHandler";
import someFires from "../environment/effects/SomeFires";

class FiresHandler {
    constructor() {

    }
    init(scene) {
        someFires.getSome().then(arr => {
            arr.forEach((element, index) => {
                let coor = this.getRandomCordinates(.01, .01)
                let x = -6 + coor.x
                let z = 26 + coor.z
                element.position.y = perlin2.Get(x, -z) - .1
                element.position.x = x
                element.position.z = z
                    // element.rotation.x = Math.PI * 2 * Math.random()
                    // element.rotation.z = Math.PI * 2 * Math.random()
                    // let s = element.scale.x * (.5 + Math.random() * 1)
                    // element.scale.set(s, s, s)
                scene.add(element)
                element.castShadow = true; //default is false
                element.receiveShadow = false; //default
                // element.children.material.transparent = true;
                console.log(element);
                // element.children[0].material.emissive.r = 255
                // element.children[0].material.emissive.g = 255
                // element.children[0].material.emissive.b = 255
                machine.addCallback(() => {
                    element.rotation.y += 0.1 + .3 * Math.random()
                })
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

const firesHandler = new FiresHandler()

export default firesHandler