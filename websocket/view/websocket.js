(() => {

class WS {
    constructor(url) {
        let ws = this.ws = new WebSocket(url)

        ws.onopen = () => {
            this.dispatch('connect')
        }
        ws.onclose = () => {
            this.dispatch('disconnect')
        }
        ws.onerror = () => {
            this.dispatch('error')
        }

        ws.onmessage = (message) => {
            let json = {}
            try {
                json = JSON.parse(message.data)
            } catch (e) {
                console.log(`Invalid JSON: ${message.data}`)
                return;
            }
            this.dispatch(json.type, json.data)
        }

        this.listeners = {}
    }
    dispatch(name, data) {
        (this.listeners[name] || []).forEach((cb) => cb(data))
    }
    on(name, cb) {
        this.listeners[name] = this.listeners[name] || []
        this.listeners[name].push(cb)
    }
    un(name, cb) {
        let listeners = this.listeners[name] || []
        listeners.splice(listeners.indexOf(cb), -1)
    }
    removeAllListeners() {
        this.listeners = {}
    }
    send(type, data) {
        this.ws.send(JSON.stringify({
            type: type,
            data: data
        }))
    }
}

window.WS = WS

})()
