import MasterScene from "../engine/scenes/MasterScene";
import image from '../../src/images/characters/WoWlogo.png'
import sceneList from "./SceneList";
import cache from '../engine/basic/Cache'
import sounds from "../audio/Audios";
import icon from "../engine/ui/Icons";
import sceneHandlerObj from "./SceneHandlerObj";
import fadeHandler from "../engine/ui/FadeHandler";


class Landing extends MasterScene {
    constructor(instancename) {
        super(instancename)
        this.landing = document.createElement('div')
        this.landing.classList.add('landing')
        this.landing.style.backgroundImage = `url(${image})`
            // this.btn = document.createElement('div')
            // this.btn.innerText = 'Play Now'
            // this.btn.classList.add('play-now')
            // this.landing.appendChild(this.btn)
            // this.btn.addEventListener('click', () => {
            //     fadeHandler.fadeToBlack().then(a => {
            //         sceneHandlerObj.get().goTo(sceneList.demo)
            //         setTimeout(() => {
            //             fadeHandler.fadeFromBlack()
            //         }, 100);
            //     })

        // })
        this.samuGames = document.createElement('div')
        this.samuGames.innerHTML = "Samu Games"
        this.samuGames.classList.add('samu-games')
        this.landing.appendChild(this.samuGames)
        this.samuGames.addEventListener('click', () => {
            fadeHandler.fadeToBlack().then(a => {
                this.samuGames.classList.add('hide')
                sounds.setAsLoop('intro')
                sounds.setRelativeVolume('intro', .1)
                sounds.play('intro')
                fadeHandler.fadeFromBlack()
                setTimeout(() => {
                    fadeHandler.fadeToBlack().then(a => {
                        sceneHandlerObj.get().goTo(sceneList.characterselector)
                    })
                }, 2000);
            })
        })

        let container = document.createElement('div')
        let soundDown = icon.get('ImVolumeLow')
        soundDown.classList.add('sound-down')
        container.appendChild(soundDown)
        soundDown.addEventListener('click', () => {
            let vol = sounds.getRelativeVolume('intro') - .05
            sounds.setRelativeVolume('intro', vol)
        })
        container.classList.add('sound-control')
        let soundUp = icon.get('ImVolumeHigh')
        soundUp.classList.add('sound-up')
        container.appendChild(soundUp)
        soundUp.addEventListener('click', () => {
            let vol = sounds.getRelativeVolume('intro') + .05
            sounds.setRelativeVolume('intro', vol)
        })

        document.body.appendChild(container)
    }
    open() {
        document.body.appendChild(this.landing)
    }
    close() {
        cache.appendChild(this.landing)
    }
}
let landing = new Landing()
export default landing