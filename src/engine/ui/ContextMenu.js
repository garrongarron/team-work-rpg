class ContextMenu {
    constructor(contextMenu) {
        this.contextMenu = contextMenu || { show: () => console.log('secondary button') }
        this.section = document.querySelector('canvas')
        this.isPressedFlag = false
        this.section.addEventListener('mousedown', (e) => {
            if (e.which == 3) { this.isPressedFlag = true }
        })
        this.section.addEventListener('mouseup', (e) => {
            if (e.which == 3) { this.isPressedFlag = false }
        })
    }
    isPressed() {
        return this.isPressedFlag
    }
    open() {
        this.section.addEventListener('contextmenu', this.callback.bind(this))
    }
    close() {
        this.section.removeEventListener('contextmenu', this.callback.bind(this))
    }
    callback(ev) {
        ev.preventDefault();
        this.contextMenu(ev)
    }
}

export default ContextMenu