import renderer from "../../src/engine/basic/Renderer.js"
import machine from "../../src/engine/basic/Machine.js"
import scene from "../../src/engine/basic/Scene.js";
import cube from "../../src/engine/object/Box.js";
import ocean from "../../src/engine/object/Ocean.js";
import land from "../../src/engine/object/Land";
import camera from "../../src/engine/basic/Camera.js";
import MasterScene from "../../src/engine/scenes/MasterScene.js";
import directionalLight, { ambientLight, helper, hemiLight } from "../../src/engine/basic/Light.js";
import resize from "../../src/engine/basic/Resize.js";
import maw from "../characters/Maw/Maw.js";
import CharacterController from "../../src/engine/controllers/CharacterController.js"
import settings from '../characters/Maw/Settings.js'
import cameraController from "../../src/engine/controllers/camera/CameraController.js";
import keyListener from "../engine/basic/KeyListener.js";
import eventBus from "../engine/basic/EventBus.js";
import sounds from "../audio/Audios.js";
import ContextMenu from '../engine/ui/ContextMenu.js'
import displayContextMenuGame from "./DisplayContextMenuGame.js";
import gamePlay from "./GamePlay.js";
import directionWSController from "../engine/controllers/DirectionWSController.js";
import skyTexture from "./SkyTexture.js";
import sphere from "../engine/object/Sphere.js";
import blend from "../engine/noise/Blend.js";
import ChunkManager from "../engine/noise/ChunkManager.js";


class Demo extends MasterScene {
    constructor(instancename) {
        super(instancename)
        this.mesh = null
        this.openFlag = false
        this.callback = () => {
            renderer.render(scene, camera);

            if (this.mesh) {
                directionalLight.position.x = this.mesh.position.x
                directionalLight.position.y = this.mesh.position.y + 2
                directionalLight.position.z = this.mesh.position.z
                directionalLight.target.position.set(
                    this.mesh.position.x - 2,
                    this.mesh.position.y,
                    this.mesh.position.z - 2);
                directionalLight.target.updateMatrixWorld();
                camera.position.y = this.mesh.position.y + 1
            }
        }

        let contextMenu = new ContextMenu(displayContextMenuGame)
        contextMenu.open()


        // blend.then(t => {
        //     scene.add(sphere)
        //     this.chunkManager = new ChunkManager(sphere, 1000, t)
        // })
    }
    open() {

        this.openFlag = true
        sounds.setAsLoop('walk')
        sounds.setRelativeVolume('walk', .3)
        machine.addCallback(this.callback);
        machine.on();
        keyListener.start()
        resize.open(renderer)
        scene.add(directionalLight)
            // scene.add(helper)
        scene.add(ambientLight)
        scene.add(hemiLight);
        scene.add(cube)
        cube.position.y = 0
        cube.position.z = 14
        cube.position.x = .5
        let cube2 = cube.clone()
        scene.add(cube2)
        cube2.position.y = 0
        cube2.position.z = 14
        cube2.position.x = -.5

        scene.background = skyTexture;
        maw.getObject().then(mesh => {
            this.mesh = mesh

            // cameraController.start(mesh)
            gamePlay.open(mesh)
            scene.add(mesh)
            this.characterController = new CharacterController(settings, directionWSController)
            this.characterController.setMesh(mesh)
            this.characterController.start()
            scene.add(sphere)

            this.chunkManager.setCharacter(mesh)
        });
        // scene.add(land)
        eventBus.suscribe('keyListener', (arr) => {
            if (this.openFlag && (arr[0] == 87)) {
                (arr[1] == true) ? sounds.play('walk'): sounds.stop('walk', true)
            }
        })
    }
    close() {
        this.openFlag = false
        this.characterController.stop()
        machine.removeCallback(this.callback);
        machine.pause();
        resize.close()
        scene.remove(directionalLight)
        scene.remove(ambientLight)
        scene.remove(hemiLight)
        scene.remove(cube)
    }
}

let demo = new Demo()
export default demo