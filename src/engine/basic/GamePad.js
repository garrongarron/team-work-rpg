import machine from "./Machine";

class GamePad {
    constructor() {
        this.myReq = null
        this.buttons = []
        this.axes = []
        this.gamepads = { '0': null }
        this.eventList = {}
        this.buttonsPrev = []
        this.events = { 'down': [], 'up': [] }
    }

    callback() {
        this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        if (this.gamepads['0'] == null) {
            return;
        }
        let gp = this.gamepads['0'].buttons;
        this.buttons = gp.map(element => {
            return element.value
        });
        this.axes = this.gamepads['0'].axes
        this.eventDetection()
    }
    pulse() {

    }
    eventDetection() {
        if (this.buttonsPrev.length == this.buttons.length) {
            for (let index = 0; index < this.buttons.length; index++) {
                if (this.buttons[index] != this.buttonsPrev[index]) {
                    this.dispatchButon(index, this.buttons[index] != 0)
                }
            }
        }
        this.buttonsPrev = this.buttons
    }

    dispatchButon(index, bool) {
        this.events[(bool) ? 'down' : 'up'].forEach(eventHandler => {
            eventHandler(index, this.gamepads['0'])
        })
    }
    addListener(eventName, eventHandler) {
        this.events[eventName].push(eventHandler)
    }
    removeListener(eventName, eventHandler) {
        this.events[eventName] = this.events[eventName].filter(eh => {
            return eh != eventHandler
        })
    }
    start() {
        this.callback()
        this.myReq = requestAnimationFrame(this.start.bind(this))
    }
    stop() {
        cancelAnimationFrame(this.myReq)
    }
    getAxesValue(index) {
        if (this.gamepads['0'] == null) return 0
        return this.axes[index]
    }
    getButtonValue(index) {
        if (this.gamepads['0'] == null) return 0
        return this.buttons[index]
    }
}

const gamePad = new GamePad()

export default gamePad