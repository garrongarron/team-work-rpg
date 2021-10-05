class Mouse {
    constructor() {
        this.canvas = null
        this.acumulated = {
            x: 0,
            y: 0,
        }
        this.delta = {
            x: 0,
            y: 0,
        }
        this.lockChangeAlert =
            this.lockChangeAlertHandler.bind(this)
        this.updatePosition =
            this.updatePositionHandler.bind(this)
        this.requestPointerLockFunction =
            this.requestPointerLockFunctionHandler.bind(this)
    }

    start() {
        if (this.canvas == null) {
            alert('No canvas selected')
        }
        this.canvas.requestPointerLock =
            this.canvas.requestPointerLock ||
            this.canvas.mozRequestPointerLock;

        document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock;

        this.canvas.addEventListener('click',
            this.requestPointerLockFunction)
        document.addEventListener('pointerlockchange',
            this.lockChangeAlert, false);
        document.addEventListener('mozpointerlockchange',
            this.lockChangeAlert, false);
    }

    setCanvas(canvas) {
        this.stop()
        this.canvas = canvas
    }

    requestPointerLockFunctionHandler() {
        this.canvas.requestPointerLock();
    }

    setAcumulated(newAcumulated) {
        this.acumulated = newAcumulated
    }

    lockChangeAlertHandler(e) {
        if (document.pointerLockElement === this.canvas ||
            document.mozPointerLockElement === this.canvas) {
            /* console.log(
                'The pointer lock status is now locked'
                )*/
            document.addEventListener("mousemove",
                this.updatePosition, false);
        } else {
            /* console.log(
                'The pointer lock status is now unlocked'
                )*/
            document.removeEventListener("mousemove",
                this.updatePosition);
        }
    }

    updatePositionHandler(e) {
        this.delta.x = e.movementX;
        this.delta.y = e.movementY;
        this.acumulated.x += e.movementX;
        this.acumulated.y += e.movementY;
    }

    stop() {
        if (this.canvas) this.canvas.removeEventListener('click',
            this.requestPointerLockFunction)
        document.removeEventListener("mousemove",
            this.updatePosition);
        document.removeEventListener('pointerlockchange',
            this.lockChangeAlert);
        document.removeEventListener('mozpointerlockchange',
            this.lockChangeAlert);
    }
}
let mouse = new Mouse()
export default mouse