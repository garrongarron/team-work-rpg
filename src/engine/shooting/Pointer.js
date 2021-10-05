import cache from '../basic/Cache.js'
import './pointer.scss'

class Pointer {
    constructor() {
        this.container = document.createElement('div')
        this.container.classList.add('pointer', 'hide')
        this.keydown = (e) => {
            if (e.keyCode == 69) {
                this.container.classList.remove('hide')
                this.flag = true
            }
        }
        this.keyup = (e) => {
            if (e.keyCode == 69) {
                this.container.classList.add('hide')
                this.flag = false
            }
        }
        this.instuction = document.createElement('div')
        this.instuction.classList.add('help-tmp')
        this.instuction.innerHTML = `W=>Up; S=>Down; E=>Aim; Click to shoot`
        this.flag = false

    }

    start() {
        document.body.appendChild(this.container)
        document.addEventListener('keydown', this.keydown)
        document.addEventListener('keyup', this.keyup)
        document.body.appendChild(this.instuction)
    }
    stop() {
        cache.appendChild(this.container)
        cache.appendChild(this.instuction)
        document.removeEventListener('keydown', this.keydown)
        document.removeEventListener('keyup', this.keyup)
        this.flag
    }
    ready() {
        return this.flag
    }
}

const pointer = new Pointer()

export default pointer