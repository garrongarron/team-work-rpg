import Loader from "../../engine/characters/Loader"
import fileList from './FileList'

class SomePlants {
    constructor() {
        this.folder = 'src/environment/plants/models/'
        this.out = []
        this.list = []
    }
    setFamily(family) {
        this.family = family
    }
    getSome() {
        this.list = Object.keys(fileList).filter(keys => {
            return keys.toLowerCase()
                .includes(this.family.toLowerCase())
        })
        this.list.forEach(fileName => {
            let scale = 0.001
            this.out.push(new Loader(
                this.folder + fileName + ".fbx", [], scale).getObject())
        })
        let out = Promise.all(this.out)
        this.out = []
        this.list = []
        return out
    }
}

const somePlants = new SomePlants()

export default somePlants