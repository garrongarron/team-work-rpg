// import morak from "../characters/Morak/Morak";
import camera from "../engine/basic/Camera";
// import keyListener from "../engine/basic/KeyListener";
import directionalLight, { ambientLight } from "../engine/basic/Light";
import machine from "../engine/basic/Machine";
import renderer from "../engine/basic/Renderer";
import resize from "../engine/basic/Resize";
import scene from "../engine/basic/Scene";
import blend from "../engine/noise/Blend";
import ChunkManager from "../engine/noise/ChunkManager";
import cube from "../engine/object/Box";
import MasterScene from "../engine/scenes/MasterScene";
import skyTexture from "./SkyTexture";
import sphere from "../engine/object/Sphere";
import addGrass from "../environment/grass/Grass";

class Grassscene extends MasterScene {
    constructor() {
        super()
        this.callback = () => {
            renderer.render(scene, camera);
        }
    }
    open() {
        machine.addCallback(this.callback);
        machine.on();
        // keyListener.start()
        resize.open(renderer)
        scene.add(directionalLight)
        scene.add(ambientLight)
            // scene.background = skyTexture;
        this.getTerrain();
        camera.position.set(0, 12, -10);
        cube.position.set(0, 10, 0)
        scene.add(cube)
        camera.lookAt(0, 10, 0);
        addGrass(sphere, cube)
    }
    close() {

    }
    getTerrain() {
        blend.then(t => {
            scene.add(sphere)
            this.chunkManager = new ChunkManager(sphere, 1000, t)
        })
    }
}

const grassscene = new Grassscene()

export default grassscene