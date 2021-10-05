import Loader from "../../engine/characters/Loader"
import fileList from './FileListBoats'

class SomeBoats {
    constructor() {
        this.folder = 'src/environment/furnitures/'
        this.out = []
        this.list = []
    }
    getSome() {
        this.list = fileList
        this.list.forEach(fileName => {
            // let scale = 0.003
            let scale = .003
            this.out.push(new Loader(
                this.folder + fileName + ".fbx", [], scale).getObject())
        })
        let out = Promise.all(this.out)
        this.out = []
        this.list = []
        return out
    }
}

const someBoats = new SomeBoats()

export default someBoats