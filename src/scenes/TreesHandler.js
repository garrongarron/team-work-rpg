import perlin2 from "../engine/noise/PerlinHandler";
import someTrees from "../environment/trees/SomeTrees";
import treeSelector from "./TreeSelector";

class TreeHandler {
    constructor() {}
    init(scene) {
        someTrees.getSome().then(arr => {
            arr.forEach(element => {
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
            })
            arr.forEach((element, index) => {
                let coor = this.getRandomCordinates(150, 150)
                let x = -4 + coor.x
                let z = 26 + coor.z
                element.position.y = perlin2.Get(x, -z) - .1
                element.position.x = x
                element.position.z = z
                scene.add(element)
                element.castShadow = true; //default is false
                element.receiveShadow = false; //default
            });
            treeSelector.start(arr.map(group => {
                return group.children[0]
            }))
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

const treeHandler = new TreeHandler()

export default treeHandler