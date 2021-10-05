import machine from './Machine.js'
import { Clock } from 'three';
let clock = new Clock();
let n = 0
machine.addCallback(() => {
    n = clock.getDelta();
    clock.delta = n
})

let getDelta = () => {
    return n
}

export { clock, getDelta }