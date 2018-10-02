(() => {

let setCookie = (cname, cvalue, exdays) => {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`
}

let getCookie = (cname) => {
    let name = `${cname}=`
    let cvalue = ''
    document.cookie.split(';').find((c) => {
        c = c.trim()
        if (c.indexOf(name) === 0) {
            cvalue = c.substring(name.length, c.length)
            return true
        }
        return false
    })
    return cvalue;
}

let escapeHTML = (str) => (
    str
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace(' ', '&nbsp;')
)

window.utils = {
    setCookie,
    getCookie,
    escapeHTML
}

})()
