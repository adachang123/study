function setupConnectStatus() {
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

function setupSubmitForm() {
    let sendForm = document.getElementById('send-form');

    sendForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let formData = {};
        let formChild = sendForm.children;
        let hasContent= true;
        const nameInputBox = document.getElementById('name')

        for(let i =0; i < sendForm.childElementCount; i++) {
            let child = formChild[i];
            if (child.name !== "") {
                let msg = child.value;
                hasContent = (msg === "" | !msg) ? false : true;
                if (hasContent) {
                    child.classList.remove('error')
                    formData[child.name] = msg;
                } else {
                    child.classList.add('error')
                }
            }
        }
        if (hasContent)
            socket.emit("send", formData);
            setCookie('name', nameInputBox.value)
    })
}

function addMsgToBox(data) {
    let content = document.getElementById('content')
    let msgBox = document.createElement('div')
    msgBox.className = 'msg'
    let nameBox = document.createElement('span')
    nameBox.className = 'name'
    let name = document.createTextNode(data.name)
    let msg = document.createTextNode(data.msg)

    nameBox.appendChild(name)
    msgBox.appendChild(nameBox)
    msgBox.appendChild(msg)
    content.appendChild(msgBox)

    if (content.children.length > max_record) {
        rmMsgFromBox()
    }
}

function rmMsgFromBox() {
    let content = document.getElementById('content')
    let childs = content.children
    childs[0].remove()
}

function setupReceiveMsg() {
    let content = document.getElementById('content');
    const nameInputBox = document.getElementById('name')
    const name = getCookie('name')

    if (name) {
        nameInputBox.value = name;
    }

    socket.on('msg', addMsgToBox)
}

function loadChatRecords() {
    let max_record;

    socket.on('chatRecord', function(msgs) {
        for (let i=0; i < msgs.length; i++) {
            addMsgToBox(msgs[i]) //?? check example source
        }
    })

    socket.on('maxRecord', (amount) => {
        max_record = amount
    })
}

var max_record;

document.addEventListener("DOMContentLoaded", () => {
    setupConnectStatus();
    setupSubmitForm();
    setupReceiveMsg();
    loadChatRecords();
})