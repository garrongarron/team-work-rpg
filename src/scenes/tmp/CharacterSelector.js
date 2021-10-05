import renderer from "../../src/engine/basic/Renderer.js"
import machine from "../../src/engine/basic/Machine.js"
import scene from "../../src/engine/basic/Scene.js";
import cube from "../../src/engine/object/Box.js";
import camera from "../../src/engine/basic/Camera.js";
import MasterScene from "../../src/engine/scenes/MasterScene.js";
import directionalLight, { ambientLight, helper, hemiLight } from "../../src/engine/basic/Light.js";
import resize from "../../src/engine/basic/Resize.js";
import maw from "../characters/Maw/Maw.js";
import erika from "../characters/Erika/Erika";
import keyListener from "../engine/basic/KeyListener.js";
import skyTexture from "./SkyTexture.js";
import characterSelectorUI from "./characterSelector/CharacterSelectorUI.js";
import characterSelectorList from "./characterSelector/CharacterSelectorList.js";
import settings from '../characters/Maw/Settings.js'
import settings2 from '../characters/Erika/Settings.js'
import CharacterController from "../engine/controllers/CharacterController.js";
import directionNoneController from "../engine/controllers/DirectionNoneController.js";

class CharacterSelector extends MasterScene {
    constructor(instancename) {
        super(instancename)
        this.mesh = null
        this.callback = () => {
            renderer.render(scene, camera);
        }
        this.scenehandler = null
    }

    open(scenehandler) {
        this.scenehandler = scenehandler
        machine.addCallback(this.callback);
        machine.on();
        // keyListener.start()
        resize.open(renderer)
        scene.add(directionalLight)
        scene.add(ambientLight)
        scene.add(hemiLight);
        scene.background = skyTexture;
        maw.getObject().then(mesh => {
            this.mesh = mesh
            this.mesh.position.set(-4, 0, 24)
            this.characterController1 = new CharacterController(settings, directionNoneController)
            this.characterController1.setMesh(mesh)
            this.characterController1.start()
        });
        erika.getObject().then(mesh => {
            this.mesh = mesh
            this.mesh.position.set(-4, 0, 24)
            this.characterController2 = new CharacterController(settings2, directionNoneController)
            this.characterController2.setMesh(mesh)
            this.characterController2.start()
        });
        camera.rotation.y = -15 * Math.PI / 180
        camera.position.set(-4, 0, 26)
        characterSelectorUI.start(characterSelectorList, this)
    }

    close() {
        machine.removeCallback(this.callback);
        machine.pause();
        resize.close()
        scene.remove(directionalLight)
        scene.remove(ambientLight)
        scene.remove(hemiLight)
        scene.remove(cube)
        scene.remove(this.mesh)
        this.characterController1.stop()
        this.characterController2.stop()
    }
}

let characterSelector = new CharacterSelector()
export default characterSelector