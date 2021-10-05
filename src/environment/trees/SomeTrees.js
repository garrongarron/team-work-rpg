import Loader from "../../engine/characters/Loader"
import fileList from './FileList'

class SomeTrees {
    constructor() {
        this.folder = 'src/environment/trees/models/'
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

const someTrees = new SomeTrees()

export default someTrees