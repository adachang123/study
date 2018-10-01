(() => {

let { setCookie, getCookie, escapeHTML } = window.utils

let socket = io()
let maxRecordCount = 0

let setupConnectStatus = () => {
    let status = document.getElementById('status')
    let online = document.getElementById('online')

    socket.on('connect', () => {
        status.innerText = 'Connected'
    })
    socket.on('disconnect', () => {
        status.innerText = 'Disconnected'
    })
    socket.on('online', (ammount) => {
        online.innerText = ammount
    })
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
            socket.emit('send', formData)
            setCookie('name', formData.name)
        }
    })
}

let setupRemoveAllBtn = () => {
    let btn = document.getElementById('remove-all-btn')
    btn.addEventListener('click', () => {
        socket.emit('remove-all')
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

let setupMsgEvents = () => {
    let content = document.getElementById('content')
    let sendForm = document.forms['send-form']
    let name = getCookie('name')

    if (name) {
        sendForm.elements.name.value = name
    }

    socket.on('msg', addMsgToBox)
    socket.on('msg-clear', clearMsgs)
}

let loadChatRecords = () => {
    socket.on('chat-records', (msgs) => {
        msgs.forEach(addMsgToBox)
    })

    socket.on('max-record', (amount) => {
        maxRecordCount = amount
    })
}

document.addEventListener('DOMContentLoaded', () => {
    setupConnectStatus()
    setupSubmitForm()
    setupRemoveAllBtn()
    setupMsgEvents()
    loadChatRecords()
})

})()
