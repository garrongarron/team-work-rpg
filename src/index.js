import './style.scss'
import SceneHandler from './engine/scenes/SceneHandler.js';
import sceneList from './scenes/SceneList.js'
import sceneHandlerObj from './scenes/SceneHandlerObj';

let scenehandler = new SceneHandler(sceneList)
sceneHandlerObj.set(scenehandler)
scenehandler.goTo(sceneList.gamepad)