import { Ray, Box3 } from 'three';

class RaycasterClass {
    constructor() {
        this.raycaster = new Ray();
        this.camera = null
        this.scene = null
        this.available = false
        this.pointer = { x: null, y: null }
        this.selector = null
        this.callback = null
    }

    settingUp(camera, scene, selector, mesh) {
        this.camera = camera
        this.scene = scene
        this.selector = selector
        this.box = new Box3();
        this.mesh = mesh

        document.querySelector(this.selector)
            .removeEventListener('mousemove',
                this.onPointerMove.bind(this))

        document.querySelector(this.selector)
            .addEventListener('mousemove',
                this.onPointerMove.bind(this))

    }
    setFromCamera() {
        this.raycaster.origin.setFromMatrixPosition(this.camera.matrixWorld);
        this.raycaster.direction.set(this.pointer.x, this.pointer.y, 0.5)
            .unproject(this.camera).sub(this.raycaster.origin).normalize();
    }

    shot() {
        if (!this.available) return
        this.setFromCamera();
        this.box.setFromObject(this.mesh)
        if (this.raycaster.intersectsBox(this.box)) {
            if (this.callback != null) {
                this.callback(this)
            }
        }
    }
    setCallback(callback) {
        this.callback = callback
    }

    onPointerMove(event) {
        this.event = event
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    start() {
        this.available = true
    }

    stop() {
        this.available = false
        document.querySelector(this.selector)
            .removeEventListener('mousemove',
                this.onPointerMove.bind(this))
    }
}

let raycaster = new RaycasterClass()

export default raycaster