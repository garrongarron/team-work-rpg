import SceneHandler from './scenes/SceneHandler.js';
import sceneList from '../src/scenes/SceneList.js'


let scenehandler = new SceneHandler(sceneList)
scenehandler.goTo(sceneList.demo)