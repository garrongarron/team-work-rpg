import perlin2 from "../engine/noise/PerlinHandler";
import someAnimals from '../characters/Animals/SomeAnimals'
import CharacterController from "../engine/controllers/CharacterController";
import directionNoneController from "../engine/controllers/DirectionNoneController";
import settings from '../characters/Animals/Settings.js'

class AnimalsHandler {
    constructor() {}
    init(scene) {
        someAnimals.getSome().then(arr => {
            arr.forEach((element, index) => {
                let coor = this.getRandomCordinates(0, 0)
                let x = 28 + coor.x + index * 2
                let z = 52 + coor.z
                element.position.y = perlin2.Get(x, -z) - .1
                element.position.x = x
                element.position.z = z
                scene.add(element)
                element.name = (index == 1) ? 'horse' : 'caw'
                element.castShadow = true; //default is false
                element.receiveShadow = false; //default
                setTimeout(() => {
                    this.cc = new CharacterController(settings, directionNoneController)
                    this.cc.setMesh(element)
                    this.cc.start()
                }, index * 3000);
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

const animalsHandler = new AnimalsHandler()

export default animalsHandler