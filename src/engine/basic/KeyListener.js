import eventBus from "./EventBus.js"

let keyCaster = (arr) => {
    eventBus.dispatchEvent('keyListener', arr)
}

class KeyListener {
    constructor(channel) {
        this.keys = {}
        this.handler = [
            this.down.bind(this),
            this.up.bind(this),
            channel || console.log
        ]

    }

    start() {
        document.addEventListener('keydown', this.handler[0])
        document.addEventListener('keyup', this.handler[1])
    }

    stop() {
        document.removeEventListener('keydown', this.handler[0])
        document.removeEventListener('keyup', this.handler[1])
        for (let key in this.keys) {
            this.keys[key] = false
        }
    }

    down(e) {
        if (this.keys[e.keyCode] == true) return
        this.keys[e.keyCode] = true
        if (e.keyCode == 18) e.preventDefault()
            // if (e.keyCode == 17) e.preventDefault()
        this.handler[2]([e.keyCode, true, this.keys])
        return false
    }

    up(e) {
        if (this.keys[e.keyCode] == false) return
        this.keys[e.keyCode] = false
        if (e.keyCode == 18) e.preventDefault()
            // if (e.keyCode == 17) e.preventDefault()
        this.handler[2]([e.keyCode, false, this.keys])
        return false
    }

    isPressed(keyCode) {
        return this.keys[keyCode] ? this.keys[keyCode] : false
    }
}
const keyListener = new KeyListener(keyCaster)
export default keyListener