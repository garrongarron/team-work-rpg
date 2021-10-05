// import morak from "../characters/Morak/Morak";
import camera from "../engine/basic/Camera";
// import keyListener from "../engine/basic/KeyListener";
import directionalLight, { ambientLight } from "../engine/basic/Light";
import machine from "../engine/basic/Machine";
import renderer from "../engine/basic/Renderer";
import resize from "../engine/basic/Resize";
import scene from "../engine/basic/Scene";
// import blend from "../engine/noise/Blend";
// import ChunkManager from "../engine/noise/ChunkManager";
import cube from "../engine/object/Box";
// import sphere from "../engine/object/Sphere";
import MasterScene from "../engine/scenes/MasterScene";
import tree from "../environment/trees/Tree";
// import rainingEffect from "../environment/effects/raining/RainingEffect";
import skyTexture from "./SkyTexture";

class River extends MasterScene {
    constructor() {
        super()
        this.callback = () => {
            renderer.render(scene, camera);
        }
    }
    open() {
        machine.addCallback(this.callback);
        machine.on();
        // keyListener.start()
        resize.open(renderer)
        scene.add(directionalLight)
            // scene.add(helper)
        scene.add(ambientLight)
        scene.background = skyTexture;
        // this.getTerrain()
        //
        camera.position.set(0, 5, -40);
        camera.lookAt(0, 3, 0);
        // scene.add(cube)
        cube.scale.set(.5, .5, .5)
        cube.position.set(0, 0, 0)
            // morak.getObject().then(mesh => {
            //     scene.add(mesh)
            //     console.log(mesh);
            //     mesh.rotation.y = Math.PI
            //     camera.lookAt(mesh.position);
            // });
        tree.getObject().then(mesh => {
            scene.add(mesh);
            for (let index = 0; index < 10; index++) {
                let clone = mesh.clone()
                scene.add(clone);
                clone.position.x = Math.random() * 10
                clone.position.y = 0
                clone.position.z = Math.random() * 10

            }
            console.log(mesh);
            mesh.children.forEach(child => {
                child.material.transparent = true
            })

            machine.addCallback(() => {
                mesh.rotation.y += 0.01
            })

        });
        // rainingEffect.start(scene)
    }
    close() {

    }
    getTerrain() {
        // blend.then(t => {
        //     scene.add(sphere)
        //     this.chunkManager = new ChunkManager(sphere, 1000, t)
        // })
    }
}

const river = new River()

export default river