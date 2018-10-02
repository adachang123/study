(() => {

let { setCookie, getCookie, escapeHTML } = window.utils

let maxRecordCount = 0

let ws = new WS('ws://localhost:1337');

let setupWSEvents = () => {
    let status = document.getElementById('status')

    // system status
    ws.on('connect', () => { status.innerText = 'Connected' })
    ws.on('disconnect', () => { status.innerText = 'Disconnected' })
    ws.on('count', (json) => {
        let online = document.getElementById('online')
        online.innerText = json.count
    })
    ws.on('max-record', (json) => { maxRecordCount = json.size })
    ws.on('chat-records', (json) => { json.messages.forEach(addMsgToBox) })

    // actions
    ws.on('msg', (json) => { addMsgToBox(json.msg) })
    ws.on('msg-clear', clearMsgs)
}

let setupSubmitForm = () => {
    let sendForm = document.forms['send-form']

    sendForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let hasContent = true
        let formData = Array.from(sendForm.elements).reduce((obj, input) => {
            if (!input.name) {
                return obj
            }

            obj[input.name] = input.value
            if (!input.value) {
                input.classList.add('error')
                hasContent = false
            } else {
                input.classList.remove('error')
            }
            return obj
        }, {
            time: new Date().toUTCString()
        })

        if (hasContent) {
            ws.send('new-msg', formData)
            setCookie('name', formData.name)
        }
    })
}

let setupRemoveAllBtn = () => {
    let btn = document.getElementById('remove-all-btn')
    btn.addEventListener('click', () => {
        ws.send('remove-all')
    })
}

let addMsgToBox = (data) => {
    let content = document.getElementById('content')

    let msgBox = document.createElement('div')
    msgBox.classList.add('msg')
    msgBox.innerHTML = [
        `<span class="name">${escapeHTML(data.name)}</span>`,
        `${escapeHTML(data.msg)}`,
    ].join('')
    content.appendChild(msgBox)

    if (content.children.length > maxRecordCount) {
        rmMsgFromBox()
    }
}

let rmMsgFromBox = () => {
    let content = document.getElementById('content')
    if (content.children.length === 0) {
        return
    }
    content.children[0].remove()
}

let clearMsgs = () => {
    let content = document.getElementById('content')
    content.innerHTML = ''
}

let loadCookie = () => {
    let sendForm = document.forms['send-form']
    let name = getCookie('name')

    if (name) {
        sendForm.elements.name.value = name
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupWSEvents()
    setupSubmitForm()
    setupRemoveAllBtn()
    loadCookie()
})

})()
