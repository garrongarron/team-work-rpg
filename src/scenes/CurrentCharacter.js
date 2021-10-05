class CurrentCharacter {
    constructor() {
        this.character = null
    }
    start(mesh) {
        this.character = mesh
    }
    stop() {
        this.character = null
    }
}

const currentCharacter = new CurrentCharacter()
export default currentCharacter