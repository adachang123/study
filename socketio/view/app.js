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

        for(let i =0; i < sendForm.childElementCount; i++) {
            let child = formChild[i];
            if (child.name !== "") {
                formData[child.name] = child.value;
            }
        }
        socket.emit("send", formData);
    })
}

function setupReceiveMsg() {
    let content = document.getElementById('content');

    socket.on('msg', (data) => {
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
    })
}

document.addEventListener("DOMContentLoaded", () => {
    setupConnectStatus();
    setupSubmitForm();
    setupReceiveMsg();
})