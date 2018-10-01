document.addEventListener("DOMContentLoaded", () => {
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
})