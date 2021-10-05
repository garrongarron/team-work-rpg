import FiniteStateMachineHacked from "./FiniteStateMachineHacked.js";

let settings = {
    'idle': {
        transition: (input) => {
            let state = 'idle'
            return state
        }
    }
}

let directionNoneController = new FiniteStateMachineHacked('idle', settings)


export default directionNoneController