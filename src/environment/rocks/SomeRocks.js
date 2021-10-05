import Loader from "../../engine/characters/Loader"
import fileList from './FileList'

class SomeRocks {
    constructor() {
        this.folder = 'src/environment/rocks/models/'
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

const someRocks = new SomeRocks()

export default someRocks