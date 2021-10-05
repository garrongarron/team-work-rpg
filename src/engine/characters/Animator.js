import machine from '../basic/Machine.js'
import * as THREE from 'three';

let interpolationTime = .2

class Animator {
    constructor(mesh) {
        this.mixer = new THREE.AnimationMixer(mesh)
        this.clock = new THREE.Clock()
        this.inProgress = false
        this.callback = () => {
            this.mixer.update(this.clock.getDelta());
        }
        this.onLoopFinished = function() {
            this.inProgress = false
        }

        this.clips = mesh.animations.map(animation => {
            return this.mixer.clipAction(animation)
        })

        this.lastClip = null
    }
    start() {
        machine.addCallback(this.callback)
    }
    stop() {
        machine.removeCallback(this.callback)
    }
    action(m, timeScale, loop) {
        //wait for loop
        if (this.inProgress) return
        if (loop) {
            this.mixer.addEventListener('loop', this.onLoopFinished.bind(this));
            this.inProgress = true
        }
        //speed uot
        this.mixer.timeScale = timeScale
            //first time
        if (this.lastClip === null) {
            this.clips[m].play();
            this.lastClip = m
            return
        }
        //repetition
        if (this.lastClip == m) return
        this.clips[m].reset();
        this.clips[m].play();
        this.clips[this.lastClip].crossFadeTo(this.clips[m], interpolationTime, true);
        this.lastClip = m
    }
}

export default Animator