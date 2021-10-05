import Animator from "../characters/Animator.js";
import ModeController from "../controllers/ModeController.js";

class Modes {
    constructor(mesh, settings) {
        this.animator = new Animator(mesh)

        this.modes = {}
        Object.keys(settings).forEach(key => {
            this.modes[key] = new ModeController(this.animator, settings[key].actions)
        });

    }
    getModes() {
        return this.modes
    }
    start() {
        this.animator.start()
    }
    stop() {
        this.animator.stop()
    }
}

export default Modes