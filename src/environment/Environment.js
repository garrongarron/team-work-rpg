import Loader from "../engine/characters/Loader"
import fileList from './plants/FileList'

let model = 'src/environment/plants/' + fileList.BushFlowers

let scale = 0.001
let plant = new Loader(model, [], scale)

export default plant