class SceneHandelerObj {
    constructor() {
        this.sceneHandler = null
    }
    set(sh) {
        this.sceneHandler = sh
    }
    get() {
        return this.sceneHandler
    }
}

const sceneHandlerObj = new SceneHandelerObj()

export default sceneHandlerObj