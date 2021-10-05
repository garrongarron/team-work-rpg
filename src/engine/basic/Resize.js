import camera from "./Camera.js";
class Resize {
    constructor() {
        this.renderer = null
        this.callback = this.resize.bind(this)
    }
    open(renderer) {
        this.renderer = renderer
        window.addEventListener('resize', this.callback);
        this.resize()
    }
    close() {
        window.removeEventListener('resize', this.callback);
    }
    resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
const resize = new Resize()
export default resize