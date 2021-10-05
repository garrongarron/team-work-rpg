import { clock } from '../../basic/Clock.js'
import keyCode from '../../basic/KeyCode.js';
import keyListener from '../../basic/KeyListener.js'
import { Raycaster, Vector3 } from 'three'
import camera from '../../basic/Camera'
import rocksHandler from '../../../scenes/RocksHandler.js';
import someCastels from '../../../environment/buildings/SomeCastels.js';
import gamePad from '../../basic/GamePad.js';

class DisplacementCamWSController {
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
        let vector1 = new Vector3(0, 0, -1);
        vector1.applyQuaternion(camera.quaternion);
        let ray1 = new Raycaster(
            new Vector3(this.target.position.x,
                this.target.position.y + 1,
                this.target.position.z),
            vector1, 0, .4
        );
        someCastels.getSome().then(castle => {
            let cameraCollisions = [castle[0]]
            cameraCollisions = cameraCollisions.concat(rocksHandler.getRocks())
            let tmp1 = ray1.intersectObjects(cameraCollisions, true)[0]


            let ahead = keyListener.isPressed(keyCode.w) || gamePad.getAxesValue(1) < 0 || false
            if (ahead &&
                typeof tmp1 == 'undefined') {
                this.target.rotation.y = rotationWithGap2
                this.target.position.x += Math.sin(rotationWithGap2) *
                    this.speed * n
                this.target.position.z += Math.cos(rotationWithGap2) *
                    this.speed * n
                this.emit()
            }
        })




        if (keyListener.isPressed(keyCode.s)) {
            this.target.rotation.y = rotationWithGap2
            this.target.position.x -= Math.sin(rotationWithGap2) *
                this.speed * n
            this.target.position.z -= Math.cos(rotationWithGap2) *
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
let displacementCamWSController = new DisplacementCamWSController()
export default displacementCamWSController