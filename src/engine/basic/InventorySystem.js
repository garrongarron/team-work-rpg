import eventBus from "./EventBus"

class InventorySystem {
    constructor() {
        this.db = new Map()
    }
    add(item, quantity) {
        if (!this.db.has(item)) {
            this.db.set(item, 0)
        }
        let q = this.db.get(item)
        this.db.set(item, q + quantity)
        eventBus.dispatchEvent('InventorySystem', [item, this.db.get(item)])
    }
    get(item) {
        if (!this.db.has(item)) {
            this.db.set(item, 0)
        }
        return this.db.get(item)
    }

    start() {}
    stop() {}
}

const inventorySystem = new InventorySystem()

export default inventorySystem