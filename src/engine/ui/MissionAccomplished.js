import cache from "../basic/Cache"

class MissionAccomplished {
    constructor() {
        this.node = document.createElement('div')
        this.node.classList.add('mission-accomplished')
        this.node.classList.add('shrink-out')

    }
    start(message) {
        this.node.innerText = message
        document.body.appendChild(this.node)
        setTimeout(() => {
            this.node.classList.remove('shrink-out')
        }, 200);
        setTimeout(() => {
            this.stop()
        }, 3 * 1000);
    }
    stop() {
        this.node.classList.add('shrink-out')
        setTimeout(() => {
            // cache.appendChild(this.node)
        }, 2000);
    }
}

const missionAccomplished = new MissionAccomplished()

export default missionAccomplished