import Loader from "../../engine/characters/Loader"
import fileList from './FileList'

class SomeFires {
    constructor() {
        this.folder = 'src/environment/effects/models/'
        this.out = []
        this.list = []
    }
    getSome() {
        this.list = fileList
        this.list.forEach(fileName => {
            let scale = 0.01
            this.out.push(new Loader(
                this.folder + fileName + "_1.fbx", [], scale).getObject())
        })
        let out = Promise.all(this.out)
        this.out = []
        this.list = []
        return out
    }
}

const someFires = new SomeFires()

export default someFires