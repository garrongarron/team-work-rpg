import cache from "../basic/Cache"

class FadeHandler {
    constructor() {
        this.fadeNode = document.createElement('div')
        this.fadeNode.classList.add('fade-node')
    }
    fadeToBlack(time) {
        this.start()
        setTimeout(() => {
            this.fadeNode.classList.add('fade-to-black')
        }, 100);
        let promise = new Promise((res, rej) => {
            setTimeout(() => {
                res(true)
            }, time || 1000);
        })
        return promise
    }
    fadeFromBlack(time) {
        this.fadeNode.classList.remove('fade-to-black')
        let promise = new Promise((res, rej) => {
            setTimeout(() => {
                // this.fadeNode.classList.remove('fade-to-black')
                // this.fadeNode.classList.remove('fade-from-black')
                this.stop()
                res(true)
            }, time || 1000);
        })
        return promise
    }
    start() {
        document.body.appendChild(this.fadeNode)
    }
    stop() {
        cache.appendChild(this.fadeNode)
    }
}
const fadeHandler = new FadeHandler()

export default fadeHandler