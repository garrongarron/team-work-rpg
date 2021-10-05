import cache from "../basic/Cache"

class Hotkey {
    constructor() {
        this.node = document.createElement('div');
        //------------------------------------

        let ul = document.createElement('ul')
        for (let index = 0; index < 12; index++) {
            let li = document.createElement('li')
            li.innerText = index
            ul.appendChild(li)
        }
        this.node.appendChild(ul)
            //------------------------------------
        let experience = document.createElement('div')
        experience.classList.add('experience')
        this.node.appendChild(experience)
        this.node.classList.add('hotkey')
    }
    start() {
        document.body.appendChild(this.node)
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const hotkey = new Hotkey()

export default hotkey