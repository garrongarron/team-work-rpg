import machine from "../../engine/basic/Machine"
import { MathUtils, Vector3 } from 'three'

class CameraOrbitalController {
    constructor() {
        this.target = null
        this.camera = null
        this.rotation = 0
        this.radio = 5
        this.interpolation = .99
        this.callback = () => {

            if (this.target == null || this.camera == null) return;
            //
            if (this.target.position.z < 8) {


                this.rotation = this.target.position.z / 1;
                this.rotation = MathUtils.clamp(this.rotation, 0, Math.PI * 2.5)
                this.radio = 8 - MathUtils.clamp(this.target.position.z, 0, 5)
                    //
                let x = this.target.position.x -
                    Math.sin(this.rotation) *
                    this.radio;
                this.camera.position.x = MathUtils.lerp(
                    this.camera.position.x,
                    x,
                    this.interpolation)

                let z = this.target.position.z -
                    Math.cos(this.rotation) * this.radio;
                this.camera.position.z = MathUtils.lerp(
                    this.camera.position.z,
                    z,
                    this.interpolation)
            }
            if (this.target.position.z > 12) {
                this.close()
            }

            this.camera.lookAt(this.target.position.clone().add(new Vector3(0, .5, 0)))
        }
    }
    set(mesh, camera) {
        this.target = mesh
        this.camera = camera
    }
    open() {
        machine.addCallback(this.callback)
    }
    close() {
        machine.removeCallback(this.callback)
    }
}

const cameraOrbitalController = new CameraOrbitalController()

export default cameraOrbitalController