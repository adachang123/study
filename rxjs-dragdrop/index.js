console.log('Hi Rx')

const video = document.getElementById('video')
const anchor = document.getElementById('anchor')

const scroll = Rx.Observable.fromEvent(document, 'scroll')

scroll
    .map(e => anchor.getBoundingClientRect().bottom < 0)
    .subscribe(scrolledBellow => {
        if (scrolledBellow) {
            video.classList.add('video-fixed')
        } else {
            video.classList.remove('video-fixed')
        }
        console.log(video.classList)
    })