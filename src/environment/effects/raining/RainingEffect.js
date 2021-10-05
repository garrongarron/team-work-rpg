import { BufferGeometry, Points, PointsMaterial, Vector3 } from 'three'
import machine from '../../../engine/basic/Machine'

class RainingEffect {
    constructor() {
        this.scene = null
    }
    start(scene) {
        if (this.scene == null) this.init(scene)
        setTimeout(() => {
            machine.addCallback(this.callback)
        }, 0.1 * 1000);
    }
    stop() {
        machine.removeCallback(this.callback)
    }
    init(scene) {
        this.scene = scene
        let rainCount = 4000
        const points = [];
        let arrayY = []
        for (let index = 0; index < rainCount; index++) {
            let rainDrop = new Vector3(
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            )
            arrayY.push(0)
            points.push(rainDrop)
        }
        this.rainGeo = new BufferGeometry().setFromPoints(points, 3);
        this.rainMaterial = new PointsMaterial({
            color: 0x111111,
            size: .05,
            transparent: true
        })
        this.rain = new Points(this.rainGeo, this.rainMaterial)
        this.rain.position.set(28.00, 11, 55.42)
        this.rain.name = 'rain'
        this.scene.add(this.rain)

        this.callback = () => {
            let positions = this.rainGeo.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const v = new Vector3(positions[i], positions[i + 1], positions[i + 2])
                positions[i] = v.x;
                arrayY[i] += Math.random() * .01
                positions[i + 1] -= arrayY[i]
                positions[i + 2] = v.z
                if (positions[i + 1] < -10) {
                    positions[i + 1] = 10
                    arrayY[i] = 0
                        // machine.pause()
                        // console.log(positions);
                }
                this.rainGeo.attributes.position.needsUpdate = true
            }

        }
    }

}

const rainingEffect = new RainingEffect()

export default rainingEffect