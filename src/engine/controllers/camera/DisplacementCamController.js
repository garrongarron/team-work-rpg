import { clock } from '../../basic/Clock.js'
import keyCode from '../../basic/KeyCode.js';
import keyListener from '../../basic/KeyListener.js'

class DisplacementCamController {
    constructor() {
        this.target = null
        this.speed = 35
        this.flag = false
        this.lastN = []
    }
    setSpeed(speed) {
        this.speed = speed
    }

    start() {
        this.flag = true
    }

    stop() {
        this.flag = false
    }

    run(rotationWithGap2) {
        if (!this.flag) return
        let n = clock.getDelta()
        this.lastN.push(n)
        if (this.lastN.length > 10) {
            n = this.lastN.reduce((a, b) => a + b, 0) / 11;
            this.lastN.shift()
        }

        if (keyListener.isPressed(keyCode.w)) {
            this.target.rotation.y = rotationWithGap2
            this.target.position.x += Math.sin(rotationWithGap2) *
                this.speed * n
            this.target.position.z += Math.cos(rotationWithGap2) *
                this.speed * n
            this.emit()
        }

        if (keyListener.isPressed(keyCode.s)) {
            this.target.rotation.y = rotationWithGap2
            this.target.position.x -= Math.sin(rotationWithGap2) *
                this.speed * n
            this.target.position.z -= Math.cos(rotationWithGap2) *
                this.speed * n
            this.emit()
        }

        if (keyListener.isPressed(keyCode.a)) {
            this.target.position.x +=
                Math.sin(rotationWithGap2 + Math.PI * .5) *
                this.speed * n
            this.target.position.z +=
                Math.cos(rotationWithGap2 + Math.PI * .5) *
                this.speed * n
            this.emit()
        }

        if (keyListener.isPressed(keyCode.d)) {
            this.target.position.x +=
                Math.sin(rotationWithGap2 - Math.PI * .5) *
                this.speed * n
            this.target.position.z +=
                Math.cos(rotationWithGap2 - Math.PI * .5) *
                this.speed * n
            this.emit()
        }
    }

    setTarget(target) {
        this.target = target
    }

    setCallback(callback) {
        this.callback = callback
    }
    emit() {
        if (this.callback != null) {
            this.callback()
        }
    }
}
let displacementCamController = new DisplacementCamController()
export default displacementCamController