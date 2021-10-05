import renderer from "../engine/basic/Renderer.js"
import machine from "../engine/basic/Machine.js"
import scene from "../engine/basic/Scene.js";
import cube from "../engine/object/Box.js";
import ocean from "../engine/object/Ocean.js";
import land from "../engine/object/Land";
import camera from "../engine/basic/Camera.js";
import MasterScene from "../engine/scenes/MasterScene.js";
import directionalLight, { ambientLight, helper, hemiLight } from "../engine/basic/Light.js";
import resize from "../engine/basic/Resize.js";
import maw from "../characters/Maw/Maw.js";
import CharacterController from "../engine/controllers/CharacterController.js"
import settings from '../characters/Maw/Settings.js'
import cameraController from "../engine/controllers/camera/CameraController.js";
import keyListener from "../engine/basic/KeyListener.js";
import eventBus from "../engine/basic/EventBus.js";
import sounds from "../audio/Audios.js";
import ContextMenu from '../engine/ui/ContextMenu.js'
import displayContextMenuGame from "./DisplayContextMenuGame.js";
// import gamePlay from "./GamePlay.js";
import displacementCamController from "../engine/controllers/camera/DisplacementCamController.js";
import gamePlay2 from "./GamePlay2.js";
import directionWSController from "../engine/controllers/DirectionWSController.js";
import skyTexture from "./SkyTexture.js";
import gravity from "../engine/basic/Gravity.js";
import sphere from "../engine/object/Sphere.js";

class Scene2 extends MasterScene {
    constructor(instancename) {
        super(instancename)
        this.openFlag = false
        this.mesh = null
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
            }
            displacementCamController.run(0)
        }

        let contextMenu = new ContextMenu(displayContextMenuGame)
        contextMenu.open()
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
        maw.getObject()
            .then(mesh => {
                this.mesh = mesh
                cameraController.start(mesh)
                cameraController.setAfterProcessCallback((obj) => {
                    let data = gravity.check(camera.position, sphere.children, 1)
                    if (data.isGrounded && data.tmp.distance < 1) {
                        camera.position.y += 1.05 - data.tmp.distance
                        obj.lookAtTarget()
                    }
                })
                camera.position.y = this.mesh.position.y + 1
                gamePlay2.open(mesh)
                scene.add(mesh)
                this.characterController = new CharacterController(settings, directionWSController)
                this.characterController.setMesh(mesh)
                this.characterController.start()
                displacementCamController.setTarget(mesh)
                displacementCamController.start()
                displacementCamController.setSpeed(20)
            })
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
        this.mesh.position.set(0, -.22, -10)
    }
}

let demo = new Scene2()
export default demo