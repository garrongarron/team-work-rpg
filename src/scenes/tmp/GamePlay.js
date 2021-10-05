import camera from "../engine/basic/Camera"
import gravity from "../engine/basic/Gravity"
import machine from "../engine/basic/Machine"
import displacementCamController from "../engine/controllers/camera/DisplacementCamController"
import sphere from "../engine/object/Sphere"
import fadeHandler from "../engine/ui/FadeHandler"
import cameraOrbitalController from "./CameraOrbitalController"
import sceneHandlerObj from "../SceneHandlerObj"
import sceneList from "../SceneList"

class GamePlay {
    constructor() {
        this.mesh = null
        this.messages = [
            "Press W",
            "Why is he running?",
            "He is seriously injured",
            "Do you want to know what happened with him?"
        ]
        this.messageContainer = document.createElement('div')
        this.messageContainer.classList.add('message-container')
        document.body.appendChild(this.messageContainer)
        this.why = true
        this.callback = () => {
            displacementCamController.run(0)
            if (this.mesh && this.mesh.position.z > 10 && this.why) {
                this.showMessage(2)
                setTimeout(() => {
                    this.showMessage(4)
                }, 4000);
                setTimeout(() => {
                    this.showMessage(4)
                }, 10000);
                setTimeout(() => {
                    fadeHandler.fadeToBlack().then(e => {
                        sceneHandlerObj.get().goTo(sceneList.scene2)
                        fadeHandler.fadeFromBlack().then(a => {})
                    })
                }, 13000);
                this.why = false
            }
        }
    }
    open(mesh) {
        this.mesh = mesh
        setTimeout(() => {
            this.showMessage(4)
        }, 2000);
        machine.addCallback(this.callback)
        cameraOrbitalController.set(mesh, camera)
        cameraOrbitalController.open()
        displacementCamController.setTarget(mesh)
        displacementCamController.start()
        displacementCamController.setCallback(() => {
            let data = gravity.check(mesh.position, sphere.children, 1)
            if (data.isGrounded) {
                mesh.position.y += 1 - data.tmp.distance
            }
        })
    }
    showMessage(time) {
        this.messageContainer.innerText = this.messages.shift()
        setTimeout(() => {
            this.messageContainer.innerText = ''
        }, 1000 * time);
    }
    close() {
        machine.removeCallback(this.callback)
    }
}
let gamePlay = new GamePlay()
export default gamePlay