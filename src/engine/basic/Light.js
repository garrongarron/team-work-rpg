import { DirectionalLight, HemisphereLight, AmbientLight, PointLight, SpotLight, CameraHelper, SpotLightHelper } from 'three';

let directionalLight = new DirectionalLight(0x888888, .2); //.7
let distance = 50
directionalLight.position.set(0, distance, 0);
directionalLight.target.position.set(-distance, 0, -distance); //see Gravity.js
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.0005;
directionalLight.shadow.mapSize.width = 2048 * 1;
directionalLight.shadow.mapSize.height = 2048 * 1;
directionalLight.shadow.camera.near = 0.05;
directionalLight.shadow.camera.far = 150.0;
let gap = 25
directionalLight.shadow.camera.left = gap;
directionalLight.shadow.camera.right = -gap;
directionalLight.shadow.camera.top = gap;
directionalLight.shadow.camera.bottom = -gap;
directionalLight.target.updateMatrixWorld();

const helper = new CameraHelper(directionalLight.shadow.camera);

let hemiLight = new HemisphereLight(0xffff00, 0xaaaaff, 1)

let ambientLight = new AmbientLight(0xffffff, 1); //0x303030

//spot -- no ilumina bien el terreno
let pointLight = new PointLight(0x888888, 1, 4);
pointLight.position.set(150, 20, 50);
pointLight.intensity = .5

//conica -- no ilumina bien el terreno
let spotLight = new SpotLight(0x333333);
spotLight.position.set(100, 1000, 100);
spotLight.angle = 30 * Math.PI / 180
spotLight.distance = 20
spotLight.focus = 1
    //-----------------------------
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 400;
spotLight.shadow.camera.fov = 60;

// scene.add( spotLight );
let lightHelper = new SpotLightHelper(spotLight);

export default directionalLight
export { directionalLight, ambientLight, hemiLight, pointLight, helper, spotLight, lightHelper }