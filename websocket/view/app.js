(() => {

let { setCookie, getCookie, escapeHTML } = window.utils

let maxRecordCount = 0

let ws = new WebSocket('ws://localhost:1337')

let setupWSEvents = () => {
    let status = document.getElementById('status')

    ws.onopen = () => {
        status.innerText = 'Connected'
    }

    ws.onclose = () => {
        status.innerText = 'Disconnected'
    }

    ws.onerror = function (error) {
        content.html(`<p>Sorry, but there's some problem with your connection
                         or the server is down.</p>`)
    }

    ws.onmessage = function (message) {
        let json = {}
        try {
            json = JSON.parse(message.data)
        } catch (e) {
            console.log(`Invalid JSON: ${message.data}`)
            return;
        }

        switch (json.type) {
            case 'count':
                let online = document.getElementById('online')
                online.innerText = json.count
                break
            case 'msg':
                addMsgToBox(json.msg)
                break
            case 'msg-clear':
                clearMsgs()
                break
            case 'max-record':
                maxRecordCount = json.size
                break
            case 'chat-records':
                json.messages.forEach(addMsgToBox)
                break
            default:
                console.log(`Action not handled!! ${message}`)
        }
    };
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
            type: 'new-msg',
            time: new Date().toUTCString()
        })

        if (hasContent) {
            ws.send(JSON.stringify(formData))
            setCookie('name', formData.name)
        }
    })
}

let setupRemoveAllBtn = () => {
    let btn = document.getElementById('remove-all-btn')
    btn.addEventListener('click', () => {
        ws.send(JSON.stringify({type: 'remove-all'}))
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
