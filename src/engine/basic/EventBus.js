class EventBus {
    constructor() {
        this.event = {}
    }
    suscribe(eventName, callback) {
        if (!this.event[eventName]) {
            this.event[eventName] = []
        }
        this.event[eventName].push(callback)
    }
    unSuscribe(eventName, callback) {
        const index = this.event[eventName].indexOf(callback);
        if (index !== -1) {
            this.event[eventName].splice(index, 1);
        }
    }
    dispatchEvent(eventName, params) {
        if (this.event[eventName]) {
            this.event[eventName].forEach(callback => {
                callback(params)
            });
        }
    }
}

let eventBus = new EventBus()
export default eventBus