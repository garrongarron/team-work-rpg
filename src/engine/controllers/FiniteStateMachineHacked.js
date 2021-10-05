class FiniteStateMachineHacked {
    constructor(defaultState, settings) {
        this.state = defaultState
        this.settings = settings
    }

    run(input) {
        return this.transition(this.state, input)
    }

    transition(state, input) {
        let out = this.settings[state].transition(input)
        this.state = out
        return out
    }
}
export default FiniteStateMachineHacked