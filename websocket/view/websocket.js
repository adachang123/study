class WS extends Object {
    constructor(url) {
        super()
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
    
            this.dispatch(json.type, json)
        }
    }
    dispatch(eventname, data) {
        let e = new CustomEvent(eventname, {detail: data});
        document.body.dispatchEvent(e)
    }
    on(eventname, cb) {
        document.body.addEventListener(eventname, (e) => {
            cb(e.detail)
        })
    }
    send(type, data = {}) {
        data.type = type;
        this.ws.send(JSON.stringify(data))
    }
}