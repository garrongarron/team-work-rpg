import { getDelta } from "../basic/Clock.js"
import { Vector3, Raycaster, ArrowHelper } from 'three';
import scene from "../basic/Scene.js";

let moveAhead = (projectile, speed, flag) => {
    let gravity = 0.5
    let originalPosition = projectile.position.clone()
    if (projectile.verticalSpeed) {
        projectile.verticalSpeed -= (gravity * getDelta() + projectile.verticalSpeed * gravity * getDelta()) * getDelta() + (flag) ? 0.02 : 0.001
            // projectile.position.y += projectile.verticalSpeed
    }

    let vOut = new Vector3()
    vOut = projectile.getWorldDirection(vOut)
    vOut.y -= Math.abs(projectile.verticalSpeed)
    let movement = vOut.multiplyScalar(speed * getDelta())
    projectile.lookAt(movement.clone().add(projectile.position))
    projectile.position.add(movement)
    let ray = new Raycaster(
        originalPosition,
        movement.normalize(),
        speed * getDelta(),
        speed * getDelta() * 2 + 0.1
    );
    let list = scene.children.filter(element => {
        return element.name != 'rain'
    })
    return ray.intersectObjects(list, true)[0];
}

export default moveAhead