import Loader from "../../engine/characters/Loader"
import fileList from './FileList'

class SomeCastels {
    constructor() {
        this.folder = 'src/environment/buildings/models/'
        this.out = []
        this.list = []
        this.promises = null
    }
    getSome() {
        if (this.promises != null) return this.promises
        this.list = fileList
        this.list.forEach(fileName => {
            let scale = 0.003
            this.out.push(new Loader(
                this.folder + fileName + ".fbx", [], scale).getObject())
        })
        this.promises = Promise.all(this.out)
        this.out = []
        this.list = []
        return this.promises
    }
}

const someCastels = new SomeCastels()

export default someCastels