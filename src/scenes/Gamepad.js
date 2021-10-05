import MasterScene from "../engine/scenes/MasterScene.js";
import machine from "../engine/basic/Machine.js"
import gamePad from "../engine/basic/GamePad.js";

class Gamepad extends MasterScene {
    constructor() {
        super()
    }
    connected(e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        console.log(e.gamepad);
    }
    disconnected(e) {
        console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
    }
    open() {
        let display = document.createElement('div')
        document.body.appendChild(display)
        window.addEventListener("gamepadconnected", this.connected.bind(this));
        window.addEventListener("gamepaddisconnected", this.disconnected.bind(this));
        // machine.addCallback(() => {
        //     var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        //     if (gamepads['0'] == null) {
        //         return;
        //     }
        //     // console.log(gamepads);
        //     var gp = gamepads[0].buttons;
        //     let out = gp.map(element => {
        //         return element.value
        //     });
        //     console.log('running', out, gamepads[0].axes);
        //     display.innerText = JSON.stringify(out) + JSON.stringify(gamepads[0].axes)
        // })
        // machine.on()

        gamePad.start()
        gamePad.addListener('down', (index) => { console.log('down ' + index); })
        gamePad.addListener('up', (index) => { console.log('up ' + index); })

    }
    close() {

    }
}

const gamepad = new Gamepad()

export default gamepad