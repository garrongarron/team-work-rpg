import projectile from "../object/Projectile.js"
import pointer from "../shooting/Pointer.js"
import projectileSpawner from "./ProjectileSpawner.js"
import { Quaternion, Raycaster, Vector2, Vector3 } from 'three'
import camera from '../basic/Camera.js'
import scene from "../basic/Scene.js"
import audio from '../../audio/Audios'

class ProjectileSystem {
    constructor() {
        this.raycaster = new Raycaster();
        this.camera = camera
        this.scene = scene
        this.origin = null
        this.t = null
        this.frequency = 4
        this.down = () => {
            if (!pointer.ready()) return
            this.shoot()
            this.t = setInterval(() => {
                this.shoot()
            }, 1000 / this.frequency);
        }
        this.up = () => {
            clearInterval(this.t)
        }
    }
    start(origin) {
        this.origin = origin
        projectileSpawner.start()
        pointer.start()
        document.addEventListener('mousedown', this.down)
        document.addEventListener('mouseup', this.up)
    }

    stop() {
        projectileSpawner.stop()
        pointer.stop()
        document.removeEventListener('mousedown', this.down)
        document.removeEventListener('mouseup', this.up)
    }

    shoot() {
        audio.play('arrow')
        this.raycaster.setFromCamera(new Vector2(), this.camera);
        let list = this.scene.children.filter(element => {
            return element.name != 'rain'
        })
        const intersects = this.raycaster.intersectObjects(list, true)[0];
        if (intersects) {
            this.origin.lookAt(intersects.point)
        } else {
            let vOut = new Vector3()
            vOut = this.camera.getWorldDirection(vOut)
            let movement = vOut.multiplyScalar(40)
            this.origin.lookAt(movement.add(this.camera.position))
        }
        projectileSpawner.shoot(this.origin.getWorldPosition(new Vector3()), this.origin.getWorldQuaternion(new Quaternion())) //    
    }


}

let projectileSystem = new ProjectileSystem(projectile)

export default projectileSystem