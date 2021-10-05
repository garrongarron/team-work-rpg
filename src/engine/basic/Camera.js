import { PerspectiveCamera } from 'three';

const fov = 40;
const aspect = screen.width / screen.height; //1920 / 1080;
const near = .01;
const far = 1000.0;

const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 2);
camera.lookAt(0, .5, 0);

export default camera