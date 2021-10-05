class SceneHandler {
    constructor(sceneList) {
        this.prev = null
        this.sceneList = sceneList
    }
    goTo(sceneName) {
        if (this.prev != null) {
            this.prev.close()
        }
        this.sceneList[sceneName].open(this)
        this.prev = this.sceneList[sceneName]
        this.prev.setSceneHandler(this)
    }
}
export default SceneHandler