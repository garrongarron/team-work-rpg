import cache from "../basic/Cache"

class Help {
    constructor() {
        let container = document.createElement('div')
        this.text = document.createElement('div')
        this.text.classList.add('text')
        this.text.innerText = 'x'
        container.appendChild(this.text)
        let close = document.createElement('div')
        close.classList.add('close')
        close.innerText = 'x'
        container.appendChild(close)
        close.addEventListener('click', () => {
            this.stop()
        })


        let footer = document.createElement('div')
        footer.classList.add('footer')
        footer.innerText = 'Press [h] to see the help. [W-S] to walk. [mouse & click to turn]'
        container.appendChild(footer)
        this.node = document.createElement('div')
        this.node.classList.add('help')
        this.node.appendChild(container)


    }
    setText(text) {
        this.text.innerText = text
    }
    start() {
        document.body.appendChild(this.node)
        setTimeout(() => {
            this.node.classList.add('help-in')
        }, 100);
    }
    stop() {
        this.node.classList.remove('help-in')
        setTimeout(() => {
            cache.appendChild(this.node)
        }, 100);
    }
}

const help = new Help()
export default help