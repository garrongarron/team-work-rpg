import cache from "../basic/Cache"

class Wear {
    constructor() {
        this.node = document.createElement('div')
        let top = document.createElement('div')

        let title = document.createElement('div')
        title.innerText = 'Wear'
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

        let twoColumns = document.createElement('section')
        let left = document.createElement('div')
        left.classList.add('left')
        let right = document.createElement('div')
        right.classList.add('right')
        twoColumns.appendChild(left)
        twoColumns.appendChild(right);
        //------------------------------------

        let firstList = document.createElement('ul')
        let image = document.createElement('div')
        image.classList.add('image')
        let secondList = document.createElement('ul')
        left.appendChild(firstList)
        left.appendChild(image)
        left.appendChild(secondList)
        for (let index = 0; index < 8; index++) {
            let li1 = document.createElement('li')
            let li2 = document.createElement('li')
            firstList.appendChild(li1)
            secondList.appendChild(li2)
            li1.innerText = index
            li2.innerText = index
        }
        //--------------------
        let ul = document.createElement('ul')
        for (let index = 0; index < 4; index++) {
            let li = document.createElement('li')
            ul.appendChild(li)
            li.innerText = index + ' something'
        }
        right.appendChild(ul)

        this.node.appendChild(twoColumns)
        this.node.classList.add('wear')
    }
    start() {
        document.body.appendChild(this.node)
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const wear = new Wear()

export default wear