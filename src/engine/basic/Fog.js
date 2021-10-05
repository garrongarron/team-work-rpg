import { Fog, Color } from 'three'
let setFog = (scene) => {
    // scene.background = new THREE.Color( 0xAED6F1 ) //new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new Fog(scene.background, 50, 600);
    scene.fog.color.copy(new Color(0xC1C8C7)); //85929E //004542 //000F1C
}

export default setFog