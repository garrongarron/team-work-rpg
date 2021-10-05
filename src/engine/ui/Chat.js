import cache from "../basic/Cache"

class Chat {
    constructor() {
        this.node = document.createElement('div')
        let top = document.createElement('div')

        let title = document.createElement('div')
        title.innerText = 'Chat'
        top.appendChild(title)
        let close = document.createElement('div')
        close.innerText = 'x'
        close.classList.add('close')
        close.addEventListener('click', () => {
            this.stop()
        })
        top.appendChild(close)
        this.node.appendChild(top);
        //-------------------------------------
        let ul = document.createElement('ul')
        for (let index = 0; index < 5; index++) {
            let li = document.createElement('li')
            li.innerText = 'messahe ' + index
            ul.appendChild(li)

        }
        ul.classList.add('messages')
        this.node.appendChild(ul);
        //------------------------------------
        this.node.classList.add('chat')
    }
    start() {
        document.body.appendChild(this.node)
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const chat = new Chat()

export default chat