class TreesHP {
    constructor() {
        this.list = new Map()
        this.lastN = 0
    }
    try (name) {
        if (!this.list.has(name)) {
            this.list.set(name, 0)
        }
        this.lastN = this.list.get(name)
        this.lastN++;
        console.log(this.lastN);
        this.list.set(name, this.lastN)
        return (this.lastN < 3) ? true : false
    }
    getLast() {
        return this.lastN
    }
    start() {}
    stop() {}
}
const treeHP = new TreesHP()

export default treeHP