import cache from "../basic/Cache"
import bread from '../../images/food/bread.png'
import log from '../../images/food/log.png'

class Backpack {
    constructor() {
        this.data = {}
        this.icons = {
            'log': log,
            'bread': bread,
        }
        this.node = document.createElement('div')
        let top = document.createElement('div')

        let title = document.createElement('div')
        title.innerText = 'Backpack'
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
        ul.classList.add('slotContainer')
        for (let index = 0; index < 20; index++) {
            let li = document.createElement('li')
                // li.innerText = index
                // let img = document.createElement('img')
                // img.src = bread
                // li.appendChild(img)
            ul.appendChild(li)
        }
        this.node.appendChild(ul)
            //------------------------------------
        this.wallet = document.createElement('div')
        this.wallet.classList.add('wallet')
        let walletUl = document.createElement('ul')
        let bronze = document.createElement('li')
        bronze.classList.add('bronze')
        bronze.innerText = 1
        let silver = document.createElement('li')
        silver.classList.add('silver')
        silver.innerText = 10
        let gold = document.createElement('li')
        gold.classList.add('gold')
        gold.innerText = 100
        walletUl.appendChild(gold)
        walletUl.appendChild(silver)
        walletUl.appendChild(bronze)
        this.wallet.appendChild(walletUl)
        this.node.appendChild(this.wallet)
        this.node.classList.add('backpack')
    }
    add(n, item) {
        this.data[item] = n
        let data = Object.keys(this.data).map((item) => {
            return [this.data[item], item]
        })
        this.node.querySelectorAll('.slotContainer > li').forEach((li, index) => {
            li.innerHTML = ''
            if (index < n) {
                if (typeof data[index] == 'undefined') return
                let img = document.createElement('img')
                console.log(data[index][1]);
                img.src = this.icons[data[index][1]]
                li.appendChild(img)
                let number = document.createElement('div')
                number.classList.add('number')
                number.innerText = data[index][0]
                li.appendChild(number)
            } else {
                li.innerHTML = ''
            }
        })

    }
    start() {
        document.body.appendChild(this.node)
    }
    stop() {
        cache.appendChild(this.node)
    }
}

const backpack = new Backpack()

export default backpack