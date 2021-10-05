import { vec3 as Vec3, color as Color, vec2 as Vec2 } from './Vec.js'

let config = {
    VIEW_DEPTH: 20.0, //2000
    MAX_TIMESTEP: 67, // max 67 ms/frame
    HEIGHTFIELD_SIZE: 3072.0, //3072
    HEIGHTFIELD_HEIGHT: 180.001, //180.0
    BEACH_TRANSITION_LOW: 0.8,
    BEACH_TRANSITION_HIGH: 3.1,
    /*
    LIGHT_DIR: Vec3.create(0.0, 1.0, -1.0),
    FOG_COLOR: Color.create(0.74, 0.77, 0.91), //Color.create(0.74, 0.77, 0.91)
    */
    LIGHT_DIR: Vec3.create(0.0, 1.0, 0.0),
    FOG_COLOR: Color.create(0.99, 0.0, 0.91), //Color.create(0.74, 0.77, 0.91)
    // GRASS_COLOR: Color.create(0.99, 0.66, 0.0),//Color.create(0.45, 0.46, 0.19),0.376, 
    // GRASS_COLOR: Color.create(0.5882,0.7255, 0.451),//Color.create(0.45, 0.46, 0.19),, 
    GRASS_COLOR: Color.create(0.36, 0.55, 0.18), //Color.create(0.45, 0.46, 0.19),, 
    WATER_COLOR: Color.create(0.6, 0.7, 0.85),
    WIND_DEFAULT: 1.5, //1.5
    WIND_MAX: 3.0,
    MAX_GLARE: 0.25, // max glare effect amount
    GLARE_RANGE: 1.1, // angular range of effect
    GLARE_YAW: Math.PI * 1.5, // yaw angle when looking directly at sun
    GLARE_PITCH: 0.2, // pitch angle looking at sun
    GLARE_COLOR: Color.create(1.0, 0.8, 0.4),
    INTRO_FADE_DUR: 2000, //2000
    //////////////////////////////////////////
    /////////////////////////////////////////
    ////////////////////////////////////////
    BLADE_SEGS: 6, // # of blade segments
    BLADE_WIDTH: 0.04,
    BLADE_HEIGHT_MIN: 0.49,
    BLADE_HEIGHT_MAX: 0.99,
    //////////////////////////////////////////
    /////////////////////////////////////////
    ////////////////////////////////////////
    MAX_INDICES: 65536 * 2, //262144*2*2, // 65536
    TEX_SCALE: 1.0 / 6.0 // texture scale per quad
}
config.WATER_LEVEL = config.HEIGHTFIELD_HEIGHT * 0.305556 // 55.0
    ////////////////////
    ///////////////////
    //////////////////
config.BLADE_VERTS = (config.BLADE_SEGS + 1) * 2 // # of vertices per blade (1 side)
config.BLADE_INDICES = config.BLADE_SEGS * 12

//UI
config.NUM_GRASS_BLADES = 840 * 20
config.GRASS_PATCH_RADIUS = 20 //Math.round(255 / 2)

//dinamic
config.DRAW_POSITION = Vec2.create(0, 0)


export default config