import keyListener from "../basic/KeyListener.js";
import FiniteStateMachineHacked from "./FiniteStateMachineHacked.js";
// import eventBus from '../basic/EventBus.js'

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
    if (!keyListener.isPressed(65) && !keyListener.isPressed(68) && !keyListener.isPressed(87) && !keyListener.isPressed(83)) {
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
            if (lastPressed(input, 68)) {
                state = 'right'
            }
            if (lastPressed(input, 83)) {
                state = 'down'
            }
            if (lastPressed(input, 65)) {
                state = 'left'
            }
            return state
        }
    },
    'up': {
        transition: (input) => {
            let state = 'up'
            if (lastPressed(input, 68) && keyListener.isPressed(87)) {
                return state = 'up-right'
            }
            if (lastPressed(input, 65) && keyListener.isPressed(87)) {
                return state = 'up-left'
            }
            if (lastPressed(input, 83)) {
                return state = 'down'
            }
            if (lastReleased(input, 87) && keyListener.isPressed(83)) {
                return state = 'down'
            }
            if (none()) {
                return state = 'idle'
            }
            if (!keyListener.isPressed(65) && keyListener.isPressed(68)) {
                return state = 'right'
            }
            if (keyListener.isPressed(65) && !keyListener.isPressed(68)) {
                return state = 'left'
            }
            return state
        }
    },
    'right': {
        transition: (input) => {
            let state = 'right'
            if (lastPressed(input, 87) && keyListener.isPressed(68)) {
                return state = 'up-right'
            }
            if (lastPressed(input, 83) && keyListener.isPressed(68)) {
                return state = 'down-right'
            }
            if (lastPressed(input, 65)) {
                return state = 'left'
            }
            if (lastReleased(input, 68) && keyListener.isPressed(65)) {
                return state = 'left'
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
            if (lastPressed(input, 68) && keyListener.isPressed(83)) {
                return state = 'down-right'
            }
            if (lastPressed(input, 65) && keyListener.isPressed(83)) {
                return state = 'down-left'
            }
            if (lastPressed(input, 87)) {
                return state = 'up'
            }
            if (lastReleased(input, 83) && keyListener.isPressed(87)) {
                return state = 'up'
            }
            if (none()) {
                return state = 'idle'
            }
            if (!keyListener.isPressed(65) && keyListener.isPressed(68)) {
                return state = 'right'
            }
            if (keyListener.isPressed(65) && !keyListener.isPressed(68)) {
                return state = 'left'
            }
            return state
        }
    },
    'left': {
        transition: (input) => {
            let state = 'left'
            if (lastPressed(input, 87) && keyListener.isPressed(65)) {
                return state = 'up-left'
            }
            if (lastPressed(input, 83) && keyListener.isPressed(65)) {
                return state = 'down-left'
            }
            if (lastPressed(input, 68)) {
                return state = 'right'
            }
            if (lastReleased(input, 65) && keyListener.isPressed(68)) {
                return state = 'right'
            }
            if (none()) {
                return state = 'idle'
            }
            return state
        }
    },
    'up-left': {
        transition: (input) => {
            let state = 'up-left'
            if (lastReleased(input, 87) && keyListener.isPressed(65)) {
                state = 'left'
            }
            if (lastReleased(input, 65) && keyListener.isPressed(87)) {
                state = 'up'
            }
            return state
        }
    },
    'up-right': {
        transition: (input) => {
            let state = 'up-right'
            if (lastReleased(input, 87) && keyListener.isPressed(68)) {
                state = 'right'
            }
            if (lastReleased(input, 68) && keyListener.isPressed(87)) {
                state = 'up'
            }
            return state
        }
    },
    'down-left': {
        transition: (input) => {
            let state = 'down-left'
            if (lastReleased(input, 83) && keyListener.isPressed(65)) {
                state = 'left'
            }
            if (lastReleased(input, 65) && keyListener.isPressed(83)) {
                state = 'down'
            }
            return state
        }
    },
    'down-right': {
        transition: (input) => {
            let state = 'down-right'
            if (lastReleased(input, 83) && keyListener.isPressed(68)) {
                state = 'right'
            }
            if (lastReleased(input, 68) && keyListener.isPressed(83)) {
                state = 'down'
            }
            return state
        }
    }
}

let directionWASDController = new FiniteStateMachineHacked('idle', settings)
    // let state
    // eventBus.suscribe('keyListener', (arr) => {
    //     state = directionWASDController.run(arr)
    // })


export default directionWASDController