import Sound from "../engine/basic/Sound";
import log1 from './trees/FirstHit.mp3'
import log2 from './trees/SecondHit.mp3'
import log3 from './trees/ThirdHit.mp3'
import arrow from './bow-and-arrow/throw-arrow.mp3'
import arrowInWater from './water/water-arrow-splash.mp3'
import raining from './weather/raining-softly.mp3'
import horn from './battle/horn.mp3'
const sounds = new Sound({
    log1,
    log2,
    log3,
    arrow,
    arrowInWater,
    raining,
    horn
})

export default sounds