class MasterScene {
    constructor() {
        this.instanceName = this.constructor.name.toLowerCase()
        this.sceneHandler = null
    }
    open() {}
    close() {}
    toString() {
        return this.instanceName
    }
    setSceneHandler(sceneHandler) {
        this.sceneHandler = sceneHandler
    }
}

export default MasterScene