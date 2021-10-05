import machine from "../engine/basic/Machine";
import someBoats from "../environment/furnitures/SomeBoats";
import brute from '../characters/Brute/Brute.js'
import morak, { getMorak } from "../characters/Morak/Morak";
import directionNoneController from "../engine/controllers/DirectionNoneController";
import settingsMorak from '../characters/Morak/Settings'
import CharacterController from "../engine/controllers/CharacterController";
class BoatHandler {
    constructor() {
        this.boats = []
        this.arr = null
        this.check = () => {
            this.boats.forEach(index => {
                if (this.arr[index].position.z > 88) {
                    this.arr[index].position.z -= .15
                } else {
                    this.boats.filter(element => {
                        return element != index
                    })
                }
            })
            if (this.boats.length == 0) {
                machine.removeCallback(this.check.bind(this))
            }
        }
    }
    init(scene) {
        someBoats.getSome().then(arr => {
            arr.forEach(element => {
                arr.push(element.clone(true))
                arr.push(element.clone(true))
                arr.push(element.clone(true))
            })
            arr.forEach((element, index) => {
                let coor = this.getRandomCordinates(50, 50)
                let x = 22 + coor.x
                let z = 200 + coor.z
                element.position.y = 3.1
                element.position.x = x
                element.position.z = z
                    // element.position.set(28.00, 10, 56.42)
                scene.add(element)
                element.rotation.y = -Math.PI / 2;
                this.boats.push(index);
                // brute.getObject().then(mesh => {
                // });
                getMorak().getObject().then(mesh => {
                    let scale = .006
                    mesh.scale.set(scale, scale, scale)
                    mesh.position.set(
                        element.position.x,
                        element.position.y,
                        element.position.z,
                    );
                    mesh.position.z -= 1
                    morak.getObject().then(original => {
                        mesh.animations = original.animations
                        let cc = new CharacterController(settingsMorak, directionNoneController)
                        cc.setMesh(mesh)
                        cc.start()
                    })
                    element.attach(mesh);
                    mesh.rotation.y += Math.PI

                    // element.material.opacity = .01
                    // element.material.transparent = true

                });
                // element.castShadow = true; //default is false
                // element.receiveShadow = false; //default
            });
            this.arr = arr
            machine.addCallback(this.check.bind(this))
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

const boatHandler = new BoatHandler()

export default boatHandler