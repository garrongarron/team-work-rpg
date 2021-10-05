import machine from "./Machine"

class Teletransport {
    constructor() {
        this.checkPoints = []
        this.walkers = []

    }
    run() {
        this.walkers.forEach(walker => {
            for (let index = 0; index < this.checkPoints.length; index++) {
                let chekpoint = this.checkPoints[index][0]
                if (walker.position.distanceTo(chekpoint) < .5) {
                    walker.position.set(
                        this.checkPoints[index][1].x,
                        this.checkPoints[index][1].y,
                        this.checkPoints[index][1].z
                    )
                }
            }
        })
    }
    addWalkers(walker) {
        this.walkers.push(walker)
    }
    addCheckPoint(checkPoint, finalPosition) {
        this.checkPoints.push([checkPoint, finalPosition])
    }
    start() {
        machine.addCallback(this.run.bind(this))
    }
    stop() {
        machine.removeCallback(this.run.bind(this))
    }
}

const teletransport = new Teletransport()

export default teletransport