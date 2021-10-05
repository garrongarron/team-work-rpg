import cache from "../basic/Cache"
class DisplayContextMenu {
    constructor() {
        this.node = document.createElement('div')
        this.node.classList.add('display-context-menu')
        this.close = document.createElement('div')
        this.close.innerText = 'Close'
        this.close.classList.add('display-context-menu-close')
        this.close.addEventListener('click', () => {
            this.hide()
        })
    }
    init() {
        console.log('overwrite this method');
    }
    show(ev) {
        document.body.appendChild(this.node)
        this.node.appendChild(this.close)
        this.node.style.left = ev.clientX + 'px'
        this.node.style.top = ev.clientY + 'px'
        this.init()
    }
    hide() {
        cache.appendChild(this.node)
    }
}
export default DisplayContextMenu