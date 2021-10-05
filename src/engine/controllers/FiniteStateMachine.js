class FiniteStateMachine {
    constructor(defaultState, settings) {
        this.state = defaultState || 'default'
        this.settings = settings || {
            'default': {
                output: (input) => {
                    let out = 'output'
                        // out = doSomething(input)
                    return out
                },
                transition: (input) => {
                    let nextState = 'default'
                        // nextState = doSomeThingElse(input)
                    return nextState
                }
            }
        }
    }

    run(input) {
        let out = this.out(this.state, input)
        this.state = this.transition(this.state, input)
        return out
    }

    out(state, input) {
        return this.settings[state].output(input)
    }

    transition(state, input) {
        return this.settings[state].transition(input)
    }
}
export default FiniteStateMachine