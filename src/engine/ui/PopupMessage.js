class PopupMessage {
    constructor() {
        this.node = document.createElement('div')
        this.node.classList.add('popupMessageHide')
        this.cache = document.createElement('div')
    }
    trigger(text) {
        this.node.classList.add('popupMessageShow')
        this.node.innerText = text
        setTimeout(() => {
            this.node.classList.remove('popupMessageShow')
        }, 500);
    }
    start() {
        document.body.appendChild(this.node)
    }
    stop() {
        this.cache.appendChild(this.node)
    }
}

let popupMessage = new PopupMessage()

export default popupMessage