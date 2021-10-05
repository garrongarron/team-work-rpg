import * as THREE from 'three';
import mouse from '../../basic/Mouse.js'
import machine from '../../basic/Machine.js'
import camera from '../../basic/Camera.js'
import canvas from '../../basic/Canvas.js';
import { MathUtils, Raycaster, Vector3 } from 'three'
// import castleHandler from '../../../scenes/CastleHandler.js';
import someCastels from '../../../environment/buildings/SomeCastels.js';
import rocksHandler from '../../../scenes/RocksHandler.js';


class CameraController {
    constructor() {
        this.interpolation = 1
        this.rotation = 0
        this.gap = 5
        this.rotationWithGap = 0
        this.radio = 2
        this.rotationSpeed = 50
        this.characterHeight = 1.1
        this.cameraAngle = 15
        this.target = null
        this.callback = null
        this.afterProcessCallback = null
        this.controller = () => {
            if (this.target) {
                let angleRotation =
                    (mouse.acumulated.x / this.rotationSpeed)
                this.rotation = -(angleRotation) *
                    Math.PI / 180
                this.rotationWithGap = -(angleRotation + this.gap) *
                    Math.PI / 180


                let x = this.target.position.x -
                    Math.sin(this.rotation) *
                    this.radio;
                camera.position.x = THREE.MathUtils.lerp(
                    camera.position.x,
                    x,
                    this.interpolation)

                let z = this.target.position.z -
                    Math.cos(this.rotation) * this.radio;
                camera.position.z = THREE.MathUtils.lerp(
                    camera.position.z,
                    z,
                    this.interpolation)

                mouse.acumulated.y = MathUtils.clamp(mouse.acumulated.y, -300, 1200)

                this.cameraAngle = mouse.acumulated.y / 400

                camera.position.y = this.target.position.y + this.characterHeight +
                    this.cameraAngle


                /* camera.lookAt(
                    this.target.position.x, 
                    this.target.position.y, 
                    this.target.position.z)
                */
                // displacementCamController.run(rotationWithGap)
                if (this.afterProcessCallback != null) {
                    this.afterProcessCallback(this)
                }
                this.lookAtTarget()
            }
        }
    }
    setRadio(radio) {
        this.radio = radio
    }

    lookAtTarget() {
        let opositeCamPosition = {
            position: {
                x: this.target.position.x +
                    Math.sin(this.rotationWithGap) *
                    this.radio * 1,
                z: this.target.position.z +
                    Math.cos(this.rotationWithGap) *
                    this.radio * 1
            }
        }
        let origin = new Vector3(
            opositeCamPosition.position.x,
            // this.target.position.x,
            this.target.position.y - this.cameraAngle * 1 + this.characterHeight,
            opositeCamPosition.position.z
            // this.target.position.z
        )
        camera.lookAt(origin);
        //----------------------
        let vector = new THREE.Vector3(0, 0, 1);
        vector.applyQuaternion(camera.quaternion);
        let theTarget = new Vector3(this.target.position.x, this.target.position.y + this.characterHeight, this.target.position.z);
        let ray = new Raycaster(
            theTarget,
            vector, .5, camera.position.distanceTo(theTarget)
        );

        someCastels.getSome().then(castle => {
            let cameraCollisions = [castle[0]]
            cameraCollisions = cameraCollisions.concat(rocksHandler.getRocks())
            let tmp = ray.intersectObjects(cameraCollisions, true)[0]
            if (typeof tmp != 'undefined') {
                camera.position.set(tmp.point.x, tmp.point.y, tmp.point.z)
                camera.lookAt(origin)
            }
        })
    }

    setAfterProcessCallback(afterProcessCallback) {
        this.afterProcessCallback = afterProcessCallback
    }

    start(t) {
        mouse.setCanvas(canvas)
        mouse.start()
        this.target = t
        machine.addCallback(this.controller)
    }
    stop() {
        mouse.stop()
        machine.removeCallback(this.controller)
        this.target = null
        this.callback = null
    }

    moveCallback(callback) {
        this.callback = callback
    }
}

const cameraController = new CameraController()
export default cameraController