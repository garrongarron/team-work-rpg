// import machine from '../engine/basic/Machine'
import camera from '../engine/basic/Camera'
import treeHandler from './TreesHandler';
import { Raycaster, Vector2 } from 'three'
import popupMessage from '../engine/ui/PopupMessage';
import currentCharacter from './CurrentCharacter';
import eventBus from '../engine/basic/EventBus';
import cameraController from '../engine/controllers/camera/CameraController';
import treeHP from './TreesHP';
import inventorySystem from '../engine/basic/InventorySystem';
import sounds from '../audio/Audios'
import machine from '../engine/basic/Machine';
import backpack from '../engine/ui/Backpack';
class TreeSelector {
    constructor() {
        this.uuid = ''
        this.treeHP = {}
        this.cooldown = false
    }
    init() {
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        popupMessage.start()
    }
    click(event) {
        this.cooldown = true
        setTimeout(() => {
            this.cooldown = false
        }, 1000);
        this.raycaster.setFromCamera(this.mouse, camera);
        // let list = this.trees.filter((obj) => {
        //     return obj.uuid != this.uuid
        // })
        const intersects = this.raycaster.intersectObjects(this.trees);
        for (let i = 0; i < intersects.length; i++) {
            let treeV3 = intersects[i].object.getWorldPosition()
            let distance = treeV3.distanceTo(
                currentCharacter.character.getWorldPosition()
            );
            if (distance > 1) {
                popupMessage.trigger('Out of range')
                break
            }
            this.uuid = intersects[i].object.uuid
            let tmp = treeHP.try(this.uuid)

            let falling = () => {
                intersects[i].object.rotation.x -= 0.01
            }
            setTimeout(() => {
                machine.removeCallback(falling)
                machine.addCallback(falling)
            }, 600);
            setTimeout(() => {
                machine.removeCallback(falling)
            }, 1500);
            if (!tmp) {


                setTimeout(() => {
                    intersects[i].object.parent.parent.remove(intersects[i].object.parent)
                    this.trees = this.trees.filter(tree => {
                        return tree != intersects[i].object
                    })

                }, 1500);
            }
            setTimeout(() => {
                if (treeHP.getLast() == 1) sounds.play('log1')
                if (treeHP.getLast() == 2) sounds.play('log2')
                if (treeHP.getLast() == 3) sounds.play('log3')
                popupMessage.trigger('+5 log')
                inventorySystem.add('log', 5)
                backpack.start()
                backpack.add(inventorySystem.get('log'), 'log')
            }, 500);

            eventBus.dispatchEvent('keyListener', [32, true])
            setTimeout(() => {
                eventBus.dispatchEvent('keyListener', [32, false])
            }, 300);
            event.preventDefault()
            event.stopPropagation()


            break
        }
    }
    onClick(event) {
        if (this.cooldown) return
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.click(event)
    }
    start(arr) {
        this.trees = arr
        this.init()
        backpack.start()
        window.addEventListener('mousedown', this.onClick.bind(this), false);
    }
    stop() {
        backpack.stop()
        window.removeEventListener('mousedown', this.onClick.bind(this), false);
    }
}

const treeSelector = new TreeSelector()

export default treeSelector