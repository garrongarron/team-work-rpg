import camera from "../engine/basic/Camera";
import machine from "../engine/basic/Machine";
import renderer from "../engine/basic/Renderer";
import raycaster from "../../src/engine/basic/Raycaster.js";
import scene from "../engine/basic/Scene";
import MasterScene from "../../src/engine/scenes/MasterScene"
import resize from "../../src/engine/basic/Resize.js";
import { ambientLight } from "../engine/basic/Light";
import peasant from "../characters/Peasant/Peasant.js";
import maw from "../characters/Maw/Maw";
import cameraController from "../engine/controllers/camera/CameraController";
import displacementCamController from "../engine/controllers/camera/DisplacementCamController";
import plane from '../engine/object/Plane'
import keyListener from "../engine/basic/KeyListener";
import ContextMenu from "../engine/ui/ContextMenu";
import questUI from "../engine/ui/Quest";

class Mission extends MasterScene {
    constructor() {
        super()
        this.callback = () => {
            renderer.render(scene, camera);
        }
    }

    open() {
        machine.addCallback(this.callback);
        machine.on();
        resize.open(renderer)
        scene.add(ambientLight)
        keyListener.start()


        peasant.getObject().then(mesh => {
            scene.add(mesh)
            this.mesh = mesh
            cameraController.start(mesh)
            cameraController.setRadio(5)
            displacementCamController.setTarget(mesh)
            displacementCamController.setSpeed(1 * 16.7 * 10)
            cameraController.setAfterProcessCallback((camCont) => {
                displacementCamController.run(camCont.rotationWithGap)
            })
            displacementCamController.start()
        })
        maw.getObject().then(mesh => {
            scene.add(mesh)
            raycaster.settingUp(camera, scene, 'canvas', mesh)
            raycaster.start()
        })

        let contextMenu = new ContextMenu(raycaster.shot.bind(raycaster))
        contextMenu.open()
        raycaster.setCallback((ray) => {
            questUI.start(this.mesh)
        })

        scene.add(plane)
    }

    close() {
        machine.removeCallback(this.callback);
        resize.close()
    }
}

const mission = new Mission()
export default mission