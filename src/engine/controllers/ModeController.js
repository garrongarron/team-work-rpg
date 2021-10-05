class ModeController {
    constructor(animator, actions) {
        this.animator = animator
        this.actions = actions
    }
    run(state) {
        const { id, timeScale, loop } = this.actions[state]
        this.animator.action(id * 1, timeScale, loop)
    }
}

export default ModeController