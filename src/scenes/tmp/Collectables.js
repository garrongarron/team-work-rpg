import cube from '../engine/object/Box'
import sounds from '../audio/Audios'
import backpack from '../engine/ui/Backpack'
import missionAccomplished from '../engine/ui/MissionAccomplished'

class Collectables {
    constructor() {
        this.list = []
        this.scene = null
        this.t = null
        this.couner = 0
    }
    start(n, radio, scene, mesh) {
        this.scene = scene
        this.mesh = mesh
        for (let index = 0; index < n; index++) {
            let clone = cube.clone(true)
            clone.position.x = Math.random() * radio - radio / 2
            clone.position.z = Math.random() * radio - radio / 2
            this.list.push(clone)
            scene.add(clone)
        }

        this.t = setInterval(() => {
            this.list.forEach(box => {
                if (this.mesh.position.distanceTo(box.position) < 1) {
                    console.log('colleted');
                    this.scene.remove(box)
                    sounds.play('arrow')
                    this.list = this.list.filter(item => {
                        return item != box
                    })
                    this.couner++;
                    backpack.add(this.couner)
                    if (this.couner > 4) {
                        missionAccomplished.start("Mission accomplished")
                    }
                }
            })
        }, 500);
    }
    getList() {
        return this.list
    }
    stop() {
        this.list.forEach(clone => {
            this.scene.remove(clone)
        })
        this.list = []
        this.scene = null
    }
}

const collectables = new Collectables()
export default collectables