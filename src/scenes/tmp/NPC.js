import sounds from '../audio/Audios.js'
import eventBus from '../engine/basic/EventBus.js'
import keyListener from '../engine/basic/KeyListener.js'
import machine from '../engine/basic/Machine.js'
import Animator from '../engine/characters/Animator.js'
import gravity from '../engine/basic/Gravity'
import sphere from '../engine/object/Sphere.js'
class NPC {
    constructor(npc) {
        this.npc = npc
        this.animator = new Animator(npc)
        this.t = null
        this.flag = false
        this.shootFlag = false
        this.messages = [
            "Press Space to Shoot",
            "Death isn't the end",
            "Who is the monster now?",
        ]
        this.messageContainer = document.querySelector('.message-container')
        if (!this.messageContainer) {
            this.messageContainer = document.createElement('div')
            this.messageContainer.classList.add('message-container')
            document.body.appendChild(this.messageContainer)
        }
        this.credits = document.createElement('div')
        this.credits.innerText = 'by @samugarrondev'
        this.credits.classList.add('credits')
    }
    showMessage(time) {
        this.messageContainer.innerText = this.messages.shift()
        setTimeout(() => {
            this.messageContainer.innerText = ''
        }, 1000 * time);
    }
    showCredits() {
            document.body.appendChild(this.credits)
            setTimeout(() => {
                this.credits.classList.add('fadeIn')
            }, 1000);
        }
        //////////////////////////////////////////////////
    start() {
        this.animator.start()
        machine.addCallback(() => {
            if (this.flag) return
            this.npc.position.z += 0.03
            let data = gravity.check(this.npc.position, sphere.children, 1)
            if (data.isGrounded) {
                this.npc.position.y += 1 - data.tmp.distance
            }
        })

        let timer
        let shooted = false
        timer = setTimeout(() => {
            console.log(this.messages.length);
            if (this.messages.length == 3) {
                shooted = true
                this.messageContainer.innerText = this.messages.shift()
            }
        }, 1000 * 15);

        document.body.addEventListener('keydown', (e) => {
            if (e.keyCode == 32) {
                if (!shooted) {
                    this.messages.shift()
                }
                this.shoot()
                clearTimeout(timer)
            }
        })
        this.again()
        eventBus.suscribe('keyListener', (arr) => {
            if (arr[0] == 32 && arr[1] == true) {
                sounds.stop('walk', true)
                setTimeout(() => {
                    this.animator.action(45, 1, false)
                    sounds.stop('walk', true)
                    sounds.play('arrow')
                    setTimeout(() => {
                        this.animator.stop()
                    }, 2700);
                    clearTimeout(this.t)
                    this.flag = true
                }, 1200);
            }
        })
    }
    shoot() {
        machine.addCallback(() => {
            if (!this.shootFlag) {
                setTimeout(() => {
                    this.messageContainer.innerText = ''
                }, 2000);
                this.shootFlag = true
                setTimeout(() => {
                    this.showMessage(4)
                }, 1000 * 6);
                setTimeout(() => {
                    this.showMessage(50)
                }, 1000 * 12);
                setTimeout(() => {
                    this.showCredits()
                }, 1000 * 20);
            }
        })
    }

    again() {
        this.flag = !this.flag
        if (this.flag) {
            this.animator.action(8, 1, false)
            sounds.stop('walk', true)
        } else {
            sounds.play('walk')
            this.animator.action(25, 1, false)
        }
        this.t = setTimeout(() => {
            this.again()
        }, 1000 * (1 + Math.random() * 3));
    }
    stop() {
        this.animator.stop()
        clearTimeout(this.t)
    }
}

export default NPC