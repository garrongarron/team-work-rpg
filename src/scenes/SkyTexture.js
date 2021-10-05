import { CubeTextureLoader } from 'three'
import posx from '../images/space-posx.jpg'
import negx from '../images/space-negx.jpg'
import posy from '../images/space-posy.jpg'
import negy from '../images/space-negy.jpg'
import posz from '../images/space-posz.jpg'
import negz from '../images/space-negz.jpg'

console.log(posx);
const loader = new CubeTextureLoader();
const skyTexture = loader.load([
    posx,
    negx,
    posy,
    negy,
    posz,
    negz,
]);


export default skyTexture