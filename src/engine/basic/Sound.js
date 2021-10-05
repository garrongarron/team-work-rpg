class Sound {
    constructor(audioList) {
        this.audioList = audioList
        this.nodeList = {}
        Object.keys(this.audioList).map(name => {
            let audio = document.createElement('audio')
            audio.src = this.audioList[name]
            document.body.appendChild(audio)
            this.nodeList[name] = {
                nodeElement: audio,
                _volume: 1,
                loop: false
            }
        })
        this.generalVolume = 1
    }
    getRelativeVolume(name) {
        return this.nodeList[name]._volume
    }
    setRelativeVolume(name, volume) {
        this.nodeList[name]._volume = volume
        this.setGeneralVolumen(this.generalVolume)
    }
    getGeneralVolume() {
        return this.generalVolume
    }

    play(name) {
        if (this.nodeList[name].loop) {
            this.nodeList[name].nodeElement.loop = true
        }
        this.nodeList[name].nodeElement.pause();
        this.nodeList[name].nodeElement.currentTime = 0;
        this.nodeList[name].nodeElement.play()
    }

    setVolume(sound, value) {
        this.nodeList[sound]._volume = value;
        this.setGeneralVolumen(this.getGeneralVolume())
    }

    setGeneralVolumen(generalVolume) {
        this.generalVolume = (generalVolume > 1) ? 1 : generalVolume
        this.generalVolume = (this.generalVolume < 0) ? 0 : this.generalVolume
        Object.keys(this.nodeList).map(name => {
            let vol = this.nodeList[name]._volume * this.generalVolume
            this.nodeList[name].nodeElement.volume = (vol > 1) ? 1 : (vol < 0) ? 0 : vol;
        })
    }

    setAsLoop(name) {
        this.nodeList[name].loop = true
    }

    stop(name, flag) {
        this.nodeList[name].nodeElement.pause();
        if (flag) return
        this.nodeList[name].nodeElement.currentTime = 0;
    }

    stopAll(name) {
        Object.keys(this.audioList).map(name => {
            this.nodeList[name].nodeElement.pause();
            this.nodeList[name].nodeElement.currentTime = 0;
        })
    }
}
export default Sound