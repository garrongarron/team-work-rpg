import cache from "../basic/Cache"

class Spellbook {
    constructor() {
        this.node = document.createElement('div')
        let top = document.createElement('div')

        let title = document.createElement('div')
        title.innerText = 'Spellbook'
        top.appendChild(title)
        let close = document.createElement('div')
        close.innerText = 'x'
        close.classList.add('close')
        close.addEventListener('click', () => {
            this.stop()
        })
        top.appendChild(close)
        this.node.appendChild(top);

        let ul = document.createElement('ul')
        for (let index = 0; index < 12; index++) {
            let li = document.createElement('li')
            ul.appendChild(li)
            li.innerText = index + ' something'
        }
        this.node.appendChild(ul)
        this.node.classList.add('spellbook')
    }
    start() {
        document.body.appendChild(this.node)
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const spellbook = new Spellbook()

export default spellbook