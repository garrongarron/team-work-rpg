import camera from "../engine/basic/Camera";
import directionalLight from "../engine/basic/Light";
import machine from "../engine/basic/Machine";
import renderer from "../engine/basic/Renderer";
import resize from "../engine/basic/Resize";
import scene from "../engine/basic/Scene";
import ocean from "../engine/object/Ocean";
import sphere from "../engine/object/Sphere";
import MasterScene from "../engine/scenes/MasterScene";
import cube from "../../src/engine/object/Box.js";

class Shadow extends MasterScene {
    constructor(instancename) {
        super(instancename)
        this.callback = () => {
            renderer.render(scene, camera);
        }
    }
    open() {
        resize.open(renderer)
        machine.addCallback(this.callback);
        machine.on();
        scene.add(directionalLight)
        scene.add(sphere)
        scene.add(ocean)
        scene.add(cube)


    }
    close() {
        machine.removeCallback(this.callback);
        machine.off();
    }
}
let shadow = new Shadow()
export default shadow