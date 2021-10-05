import cache from "../basic/Cache"

class QuestResume {
    constructor() {
        this.node = document.createElement('div')
        let top = document.createElement('div')

        let title = document.createElement('div')
        title.innerText = 'Quest Notes'
        top.appendChild(title)
        let close = document.createElement('div')
        close.innerText = 'x'
        close.classList.add('close')
        close.addEventListener('click', () => {
            this.stop()
        })
        top.appendChild(close)
        this.node.appendChild(top);
        //------------------------------------
        let ul = document.createElement('ul')
        for (let index = 0; index < 3; index++) {
            let li = document.createElement('li')
            li.innerText = index + ' content'
            ul.appendChild(li)
        }
        this.node.appendChild(ul)
        this.node.classList.add('quest-resume')
    }
    start() {
        document.body.appendChild(this.node)
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const questResume = new QuestResume()

export default questResume