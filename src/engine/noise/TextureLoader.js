import * as THREE from 'three';

let sand = './src/images/sand.jpg'
let grass = './src/images/grass.jpg' //soil
let rock = './src/images/soil.jpg' //grass
let snow = './src/images/snow.jpg'

var loader = new THREE.TextureLoader();

let promise1 = new Promise((resolve, reject) => {
    loader.load(sand, (t1) => { resolve(t1) })
})
let promise2 = new Promise((resolve, reject) => {
    loader.load(grass, (t2) => {
        resolve(t2)
    })
})
let promise3 = new Promise((resolve, reject) => {
    loader.load(rock, (t3) => { resolve(t3) })
})

let promise4 = new Promise((resolve, reject) => {
    loader.load(snow, (t4) => { resolve(t4) })
})
let textures = Promise.all([promise1, promise2, promise3, promise4])

export default textures