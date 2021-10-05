import keyListener from "../basic/KeyListener.js";
import FiniteStateMachineHacked from "./FiniteStateMachineHacked.js";

let lastPressed = (input, n) => {
    if (input[0] == n && input[1] == true) {
        return true
    }
    return false
}
let lastReleased = (input, n) => {
    if (input[0] == n && input[1] == false) {
        return true
    }
    return false
}
let none = () => {
    if (!keyListener.isPressed(87) && !keyListener.isPressed(83)) {
        return true
    }
    return false
}
let settings = {
    'idle': {
        transition: (input) => {
            let state = 'idle'
            if (lastPressed(input, 87)) {
                state = 'up'
            }
            if (lastPressed(input, 83)) {
                state = 'down'
            }
            return state
        }
    },
    'up': {
        transition: (input) => {
            let state = 'up'
            if (lastPressed(input, 83)) {
                return state = 'down'
            }
            if (lastReleased(input, 87) && keyListener.isPressed(83)) {
                return state = 'down'
            }
            if (none()) {
                return state = 'idle'
            }
            return state
        }
    },
    'down': {
        transition: (input) => {
            let state = 'down'
            if (lastPressed(input, 87)) {
                return state = 'up'
            }
            if (lastReleased(input, 83) && keyListener.isPressed(87)) {
                return state = 'up'
            }
            if (none()) {
                return state = 'idle'
            }
            return state
        }
    }
}

let directionWSController = new FiniteStateMachineHacked('idle', settings)


export default directionWSController