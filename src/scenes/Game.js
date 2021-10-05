import renderer from "../engine/basic/Renderer.js"
import machine from "../engine/basic/Machine.js"
import scene from "../engine/basic/Scene.js";
// import raycaster from "../../src/engine/basic/Raycaster.js";
import cube from "../../src/engine/object/Box.js";
// import ocean from "../../src/engine/object/Ocean.js";
// import land from "../../src/engine/object/Land";
import bullet from '../engine/object/Sphere2'
import camera from "../engine/basic/Camera.js";
import setFog from "../engine/basic/Fog.js";
import MasterScene from "../engine/scenes/MasterScene.js";
import directionalLight, { ambientLight, helper, hemiLight, pointLight, spotLight, lightHelper } from "../engine/basic/Light.js";
import resize from "../engine/basic/Resize.js";
import maw from "../characters/Maw/Maw.js";
import CharacterController from "../engine/controllers/CharacterController.js"
import settings from '../characters/Maw/Settings.js'
import settings1 from '../characters/Peasant/Settings'
// import settingsBrute from '../characters/Brute/Settings'
// import settingsKnight from '../characters/Knight/Settings'
// import settingsMorak from '../characters/Morak/Settings'
import cameraController from "../../src/engine/controllers/camera/CameraController.js";
import keyListener from "../engine/basic/KeyListener.js";
// import eventBus from "../engine/basic/EventBus.js";
// import sounds from "../audio/Audios.js";
// import ContextMenu from '../engine/ui/ContextMenu.js'
// import displayContextMenuGame from "./DisplayContextMenuGame.js";
// import gamePlay from "./GamePlay.js";
import directionNoneController from "../engine/controllers/DirectionNoneController";
// import skyTexture from "./SkyTexture.js";
import sphere from "../engine/object/Sphere.js";
import blend from "../engine/noise/Blend.js";
import ChunkManager from "../engine/noise/ChunkManager.js";
import gravity from "../engine/basic/Gravity"
import peasant from "../characters/Peasant/Peasant.js";

// import backpack from "../engine/ui/Backpack.js";
// import questUI from "../engine/ui/Quest";
// import loot from "../engine/ui/Loot";
// import hotkey from "../engine/ui/Hotkey.js";
// import questResume from "../engine/ui/QuestResume.js";
// import chat from "../engine/ui/Chat.js";
// import wear from "../engine/ui/Wear.js";
// import spellbook from "../engine/ui/Spellbook.js";
// import plant from "../environment/Environment.js";
// import plantHandler from "./PlantsHandler.js";
// import treeHandler from "./TreesHandler.js";
// import rocksHandler from "./RocksHandler";
import castleHandler from "./CastleHandler"
// import firesHandler from "./FiresHandler"
import { Vector3 } from 'three'
import axe from "../engine/object/axe/Axe.js";
// import directionWSController from "../engine/controllers/DirectionWSController.js";
import directionWSSpaceController from "../engine/controllers/DirectionWSSpaceController.js";
// import displacementCamController from "../engine/controllers/camera/DisplacementCamController.js";
import displacementCamWSController from "../engine/controllers/camera/DisplacementCamWSController.js";
import currentCharacter from "./CurrentCharacter.js";
import help from "../engine/ui/Help.js";
// import wagon from "../environment/furnitures/Wagon.js";
// import knight from "../characters/Knight/Knight.js";
import animalsHandler from "./AnimalsHandler.js";
// import cistern from "../environment/buildings/Cistern.js";
import projectileSystem from "../engine/projectile/ProjectileSystem.js";
import pointer from "../engine/shooting/Pointer.js";
import ocean from "../engine/object/Ocean.js";
// import boatHandler from "./BoatHandler.js";
import sounds from "../audio/Audios.js";
import teletransport from "../engine/basic/Teletransport.js";
import someCastels from "../environment/buildings/SomeCastels.js";
import moveAhead from "../engine/projectile/Displacement.js";
import mouse from "../engine/basic/Mouse.js";
import gamePad from "../engine/basic/GamePad.js";
// import rainingEffect from "../environment/effects/raining/RainingEffect.js";
// import brute from "../characters/Brute/Brute.js";
// import morak from "../characters/Morak/Morak.js";
// import addGrass from '../environment/grass/Grass'

class Game extends MasterScene {
    constructor() {
        super()
        this.lastPosition = { x: null, z: null }
        this.rain = null
        this.callback = () => {
            renderer.render(scene, camera);
            if (this.mesh) {
                pointLight.position.set(this.mesh.position.x, this.mesh.position.y + 2, this.mesh.position.z - 1);
                // spotLight.position.set(this.mesh.position.x, this.mesh.position.y + 3, this.mesh.position.z);
                // spotLight.target.position.set(
                //     this.mesh.position.x + 1,
                //     this.mesh.position.y,
                //     this.mesh.position.z + 1);
                // spotLight.target.updateMatrixWorld();
                //------------------------------------------
                // pointLight.position.set(this.mesh.position.x, this.mesh.position.y + 2, this.mesh.position.z);
                //-------------------------------------------
                let unit = 50
                directionalLight.position.x = this.mesh.position.x
                directionalLight.position.y = this.mesh.position.y + unit
                directionalLight.position.z = this.mesh.position.z + unit
                directionalLight.target.position.set(
                    this.mesh.position.x - 2,
                    this.mesh.position.y,
                    this.mesh.position.z - 2);
                directionalLight.target.updateMatrixWorld();
                //-------------------------------------------
                let v3 = new Vector3(-1.83, 11.07, 38.32)
                if (v3.distanceTo(this.mesh.position) < 1) {
                    // alert('ok')
                    this.mesh.position.x -= 4
                    this.mesh.position.y += 8
                }
                ///-------------------------------------------
                if (
                    this.lastPosition.x == this.mesh.position.x &&
                    this.lastPosition.z == this.mesh.position.z
                ) return
                this.lastPosition.x = this.mesh.position.x
                this.lastPosition.z = this.mesh.position.z;
                //-------------------------------------------
                let data = gravity.check(this.mesh.position, sphere.children, 1)
                if (data.isGrounded) {
                    this.mesh.position.y += 1 - data.tmp.distance
                } else {
                    this.mesh.position.y -= .1
                }
            }
        }
        this.help = (e) => {
            if (e.keyCode == 72) {
                help.start()
            }
        }
    }
    open() {
        machine.addCallback(this.callback);
        machine.on();
        keyListener.start()
        resize.open(renderer)
        scene.add(directionalLight)
            // scene.add(helper)
        scene.add(ambientLight)
            // scene.add(spotLight)
            // scene.add(pointLight)
            // scene.add(hemiLight)
            // scene.add(lightHelper)
            //scene.background = skyTexture;
        this.getTerrain()
        setFog(scene)


        peasant.getObject().then(mesh => {
            this.mesh = mesh
            currentCharacter.start(mesh);
            // addGrass(sphere, this.mesh)
            // this.mesh.position.set(-3, 0, 24)
            // this.mesh.position.set(28.00, 10, 55.42)
            // this.mesh.position.set(200.00, 100, -200)
            this.mesh.position.set(7.912, 21.783, 41.316)
            this.mesh.position.set(-3.67, 29.93, 39.95)
            this.lastPosition.x = this.mesh.position.x
            this.lastPosition.z = this.mesh.position.z
            cameraController.start(mesh)
            cameraController.setRadio(5)
            displacementCamWSController.setTarget(mesh)
            displacementCamWSController.setSpeed(1 * 8 * 5)
            this.cc1 = new CharacterController(settings1, directionWSSpaceController)
            this.cc1.setMesh(mesh)
            this.cc1.start()
            cameraController.setAfterProcessCallback((camCont) => {
                displacementCamWSController.run(camCont.rotationWithGap);
                let data = gravity.check(camera.position, sphere.children, 1)
                if (data.isGrounded && data.tmp.distance < 1) {
                    camera.position.y += 1.05 - data.tmp.distance
                }
                mouse.acumulated.x += gamePad.getAxesValue(0) * 100
                let y = gamePad.getButtonValue(0) ? 1 : gamePad.getButtonValue(2) ? -1 : 0
                mouse.acumulated.y += y * 100
                mouse.setAcumulated(mouse.acumulated)
                    // console.log(gamePad.getAxesValue(0));

            })
            gamePad.start()
            displacementCamWSController.start()
            scene.add(mesh)
            scene.add(sphere)
            setTimeout(() => {
                this.chunkManager.setCharacter(mesh)
            }, 10 * 1000);
            document.addEventListener('keydown', (e) => {
                if (e.keyCode == 13) {
                    console.log(this.mesh.getWorldPosition());
                }
            })
            axe.getObject().then(mesh => {
                mesh.name = 'axe'
                let RightHandIndex = this.mesh.getObjectByName("RightHandIndex1")
                RightHandIndex.add(mesh)
                mesh.rotation.x = Math.PI / 2
                mesh.rotation.y = -Math.PI / 2
            });
            bullet.position.set(27.75, .6, 55.42)
            bullet.position.set(27.75, 11, 55.42)
            bullet.position.set(
                this.mesh.position.x - .4,
                this.mesh.position.y + .8,
                this.mesh.position.z + .6)

            // bullet.matrixWorld.setPosition(new Vector3(28.00, 100, 55.42));
            this.mesh.attach(bullet)
            projectileSystem.start(bullet)
            pointer.start()
                // setTimeout(() => {
                //     let horse = scene.getObjectByName("horse")
                //     console.log(horse);
                //     horse.add(this.mesh)
                //         // this.mesh.position.set(0, 0, 0)
                //     this.mesh.scale.set(1, 1, 1)

            // }, 2000);
            teletransport.addWalkers(this.mesh)
            teletransport.start()
        });
        // maw.getObject().then(mesh => {
        //         this.maw = mesh
        //         scene.add(mesh)
        //         this.maw.position.set(-2, 0, 26)
        //         let cc = new CharacterController(settings, directionNoneController)
        //         cc.setMesh(mesh)
        //         cc.start()
        //         let data = gravity.check(this.maw.position, sphere.children, 1)
        //         if (data.isGrounded) {
        //             this.maw.position.y += 1 - data.tmp.distance
        //         }

        //     })
        // treeHandler.start(scene)
        animalsHandler.start(scene)
            // rocksHandler.start(scene)
            // plantHandler.start(scene)
        castleHandler.start(scene)
            // boatHandler.start(scene);
            //-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
            // help.setText('Collect tree logs to change them by gold or tools. Click over the trees.')
            // help.start()
        document.addEventListener('keydown', this.help)
            // wagon.getObject().then(mesh => {
            //         scene.add(mesh)
            //         mesh.position.set(25.21, -0.13, 55.42)
            //     })
            // cistern.getObject().then(mesh => {
            //     scene.add(mesh)
            //     mesh.position.set(25.21, -0.13, 51.42)
            // })
            // knight.getObject().then(mesh => {
            //     scene.add(mesh)
            //     this.cc = new CharacterController(settingsKnight, directionNoneController)
            //     this.cc.setMesh(mesh)
            //     this.cc.start()
            //     mesh.position.set(27.00, -0.13, 54.42)
            //     mesh.rotation.y -= Math.PI
            // })
        scene.add(ocean)
        ocean.position.y = 3
        ocean.position.z = 100
        ocean.material.opacity = .9
        ocean.material.transparent = true
        sounds.setVolume('raining', .5)
        sounds.setAsLoop('raining')
        setTimeout(() => {
            sounds.play('raining')
        }, 5000);

        // rainingEffect.start(scene)

        setTimeout(() => {
            sounds.play('horn')
        }, 15000);

        //****************/


        teletransport.addCheckPoint(new Vector3(-1.83, 21.5, 38.32), new Vector3(-3.73, 28.52, 38))

        someCastels.getSome().then(mesh => {
            let base = mesh[0].getObjectByName("Torre1base")
            let vOut = new Vector3()

            machine.addCallback(() => {
                // base.quaternion.copy(camera.quaternion)
                base.rotation.copy(camera.rotation)
                vOut = camera.getWorldDirection(vOut)
                let movement = vOut.multiplyScalar(40)
                let target = movement.add(camera.position)
                base.lookAt(target.x, base.position.y, target.z);
            })
            let cannon = mesh[0].getObjectByName("Torre1cannon")
            cannon.rotation.x -= 45 * Math.PI / 180
            document.addEventListener('keydown', (e) => {
                if (e.keyCode == 13) {
                    let bala = cube.clone()
                    scene.add(bala)
                    bala.position.set(
                        cannon.getWorldPosition().x,
                        cannon.getWorldPosition().y,
                        cannon.getWorldPosition().z
                    )
                    vOut = camera.getWorldDirection(vOut)
                    let movement = vOut.multiplyScalar(40)
                    let target = movement.add(camera.position)
                    bala.lookAt(target.x, target.y, target.z)
                    console.log(bala.getWorldPosition());
                    bala.verticalSpeed = 0.01
                    machine.addCallback(() => {
                        console.log('moving');
                        let vOut = new Vector3()
                        vOut = bala.getWorldDirection(vOut)
                        bala.verticalSpeed = vOut.y * (30 / 1000)
                        moveAhead(bala, 60, true)
                    })
                }
            })

        })
    }
    close() {
        document.removeEventListener('keydown', this.help)
        machine.removeCallback(this.callback);
        machine.pause();
        resize.close()
        scene.remove(directionalLight)
        scene.remove(ambientLight)
            // scene.remove(hemiLight)
            // scene.remove(cube)

    }
    getTerrain() {
        blend.then(t => {
            scene.add(sphere)
            this.chunkManager = new ChunkManager(sphere, 500, t)
        })
    }
}

const game = new Game()

export default game