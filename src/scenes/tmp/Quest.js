import renderer from "../../src/engine/basic/Renderer.js"
import machine from "../../src/engine/basic/Machine.js"
import scene from "../../src/engine/basic/Scene.js";
import raycaster from "../../src/engine/basic/Raycaster.js";
import cube from "../../src/engine/object/Box.js";
import ocean from "../../src/engine/object/Ocean.js";
import land from "../../src/engine/object/Land";
import camera from "../../src/engine/basic/Camera.js";
import setFog from "../../src/engine/basic/Fog.js";
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
// import displayContextMenuGame from "./DisplayContextMenuGame.js";
import gamePlay from "./GamePlay.js";
import directionWSController from "../engine/controllers/DirectionWSController.js";
import skyTexture from "./SkyTexture.js";
import sphere from "../engine/object/Sphere.js";
import blend from "../engine/noise/Blend.js";
import ChunkManager from "../engine/noise/ChunkManager.js";
import displacementCamController from "../engine/controllers/camera/DisplacementCamController.js";
import gravity from "../engine/basic/Gravity"
import peasant from "../characters/Peasant/Peasant.js";

import backpack from "../engine/ui/Backpack.js";
import questUI from "../engine/ui/Quest";
import loot from "../engine/ui/Loot";
import hotkey from "../engine/ui/Hotkey.js";
import questResume from "../engine/ui/QuestResume.js";
import chat from "../engine/ui/Chat.js";
import wear from "../engine/ui/Wear.js";
import spellbook from "../engine/ui/Spellbook.js";
import plant from "../environment/Environment.js";
import plantHandler from "../PlantsHandler.js";
import treeHandler from "./TreesHandler.js";
import rocksHandler from "./RocksHandler";
import castelHandler from "./CastelHandler"
import firesHandler from "./FiresHandler"

class Quest extends MasterScene {
    constructor(instancename) {
        super(instancename)
        this.mesh = null
        this.mesh2 = null
        this.openFlag = false
        this.callback = () => {
            renderer.render(scene, camera);

            if (this.mesh) {
                let unit = 10
                directionalLight.position.x = this.mesh.position.x
                directionalLight.position.y = this.mesh.position.y + unit
                directionalLight.position.z = this.mesh.position.z + unit
                directionalLight.target.position.set(
                    this.mesh.position.x - 2,
                    this.mesh.position.y,
                    this.mesh.position.z - 2);
                directionalLight.target.updateMatrixWorld();
                // camera.position.y = this.mesh.position.y + 1
                let data = gravity.check(this.mesh.position, sphere.children, 1)
                if (data.isGrounded) {
                    this.mesh.position.y += 1 - data.tmp.distance
                }
            }

            if (this.mesh2) {
                let data = gravity.check(this.mesh2.position, sphere.children, 1)
                if (data.isGrounded) {
                    this.mesh2.position.y += 1 - data.tmp.distance
                }
            }
        }

        // let contextMenu = new ContextMenu(displayContextMenuGame)
        // contextMenu.open()

    }
    getTerrain() {
        blend.then(t => {
            scene.add(sphere)
            this.chunkManager = new ChunkManager(sphere, 1000, t)
        })
    }
    open() {
        this.getTerrain()
        this.openFlag = true
            // sounds.setAsLoop('walk')
            // sounds.setRelativeVolume('walk', .3)
        machine.addCallback(this.callback);
        machine.on();
        keyListener.start()
        resize.open(renderer)
        scene.add(directionalLight)
        scene.add(helper)
        scene.add(ambientLight)

        // scene.add(hemiLight);
        // scene.add(cube)
        // cube.position.y = 0
        // cube.position.z = 14
        // cube.position.x = .5
        // let cube2 = cube.clone()
        // scene.add(cube2)
        // cube2.position.y = 0
        // cube2.position.z = 14
        // cube2.position.x = -.5

        scene.background = skyTexture;
        maw.getObject().then(mesh => {
            this.mesh = mesh
            this.mesh.name = 'maw'
            this.mesh.position.set(-4, 0, 24)

            cameraController.start(mesh)
            cameraController.setRadio(5)
            displacementCamController.setTarget(mesh)
            displacementCamController.setSpeed(40)
            cameraController.setAfterProcessCallback((camCont) => {
                displacementCamController.run(camCont.rotationWithGap)
                let data = gravity.check(camera.position, sphere.children, 1)
                if (data.isGrounded && data.tmp.distance < 1) {
                    camera.position.y += 1.05 - data.tmp.distance
                }
            })
            displacementCamController.start()
                // gamePlay.open(mesh)
            scene.add(mesh)
            this.characterController = new CharacterController(settings, directionWSController)
            this.characterController.setMesh(mesh)
            this.characterController.start()
            scene.add(sphere)

            this.chunkManager.setCharacter(mesh)
        });

        hotkey.start()
        chat.start()
        wear.start()
        spellbook.start()
        backpack.start()
        this.contextMenu = new ContextMenu(raycaster.shot.bind(raycaster))
        raycaster.setCallback((ray) => {
            questUI.start()
            loot.start(ray)
            questResume.start()
        })
        peasant.getObject().then(mesh => {
            mesh.name = 'peasant'
            this.mesh2 = mesh
            mesh.position.z = 2
            mesh.position.x = 2
            mesh.position.set(-2, 0, 26)
            raycaster.settingUp(camera, scene, 'canvas', mesh)
            raycaster.start()
            this.contextMenu.open()
            scene.add(mesh)
        });
        plant.getObject().then(mesh => {
            // scene.add(mesh)
            mesh.position.set(-2, 0, 26)
        })

        plantHandler.start(scene)
        treeHandler.start(scene)
        rocksHandler.start(scene)
        castelHandler.start(scene)
        firesHandler.start(scene)
        setFog(scene)

        // scene.add(land)
        // eventBus.suscribe('keyListener', (arr) => {
        //     if (this.openFlag && (arr[0] == 87)) {
        //         (arr[1] == true) ? sounds.play('walk'): sounds.stop('walk', true)
        //     }
        // })
        document.querySelector('canvas').classList.add('glove')
    }
    close() {
        document.querySelector('canvas').classList.remove('glove')
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

let quest = new Quest()
export default quest