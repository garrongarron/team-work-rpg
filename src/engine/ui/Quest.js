import cache from "../basic/Cache"
import backpack from "../../engine/ui/Backpack";
import collectables from "../../scenes/Collectables";
import scene from "../basic/Scene";

class Quest {
    constructor() {
        this.mesh = null
        this.node = document.createElement('div')
        let top = document.createElement('div')

        let title = document.createElement('div')
        title.innerText = 'Quest'
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

        let quest = document.createElement('div')
        quest.innerText = 'Necesitamos que busques alimentos en el bosque. ' +
            'Una vez que consigas 5 unidades de alimento vuelve y te daremos 5 monedas de oro.'
        quest.classList.add('page')
        this.node.appendChild(quest)

        //--------------------------
        let footer = document.createElement('div')
        let accept = document.createElement('button')
        accept.innerText = 'Accept'
        accept.addEventListener('click', () => {
            //todo Aceptar
            backpack.start()
            collectables.start(5, 10, scene, this.mesh)
            this.stop()
        })
        let decline = document.createElement('button')
        decline.innerText = 'Decline'
        decline.addEventListener('click', () => {
            //todo nada
            this.stop()
        })
        footer.appendChild(accept)
        footer.appendChild(decline)
        footer.classList.add('footer')
        this.node.appendChild(footer)
        this.node.classList.add('quest')
    }
    start(mesh) {
        this.mesh = mesh
        document.body.appendChild(this.node)
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const quest = new Quest()

export default quest