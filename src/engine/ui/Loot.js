import cache from "../basic/Cache"

class Loot {
    constructor() {
        this.node = document.createElement('div')
        let top = document.createElement('div')

        let title = document.createElement('div')
        title.innerText = 'Loot'
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
        this.node.classList.add('loot')
    }
    start(ray) {
        console.log(ray.event.screenX, ray.event.clientX);
        document.body.appendChild(this.node)
        this.node.style.top = ray.event.clientY + 'px'
        this.node.style.left = (ray.event.clientX + 50) + 'px'
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const loot = new Loot()

export default loot