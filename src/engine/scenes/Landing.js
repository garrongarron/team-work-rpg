import renderer from "../basic/Renderer.js"
import scene from "../basic/Scene.js";
import camera from "../basic/Camera.js";
import MasterScene from "./MasterScene.js";
import cube from "../object/Box.js";
import machine from "../basic/Machine.js"
import cache from "../basic/Cache.js";
import html from "./scene1/html.js";

class Landing extends MasterScene {
    constructor(instancename) {
        super(instancename)
        this.callback = () => {
            renderer.render(scene, camera);
            // cube.rotation.y += 0.1 
        }
    }
    open() {
        machine.addCallback(this.callback);
        machine.on();

        document.body.appendChild(html)
    }
    close() {
        cache.appendChild(html)
    }
}

let landing = new Landing()
export default landing