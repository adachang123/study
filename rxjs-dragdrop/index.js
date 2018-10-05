(() => {
    let Rx = window.Rx
    const video = document.getElementById('video')

    function addFixedEffect() {
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
            })
    }

    function addDragDropEffect() {
        const mouseDown = Rx.Observable.fromEvent(video, 'mousedown')
        const mouseUp = Rx.Observable.fromEvent(document, 'mouseup')
        const mouseMove = Rx.Observable.fromEvent(document, 'mousemove')

        mouseDown
            .filter(e => video.classList.contains('video-fixed'))
            .map(e => mouseMove.takeUntil(mouseUp))
            .concatAll()
            .withLatestFrom(mouseDown, (move, down) => {
                return {
                    x: move.clientX - down.offsetX,
                    y: move.clientY - down.offsetY
                }
            })
            .subscribe(pos => {
                video.style.top = pos.y + 'px'
                video.style.left = pos.x + 'px'
            })
    }

    document.addEventListener('DOMContentLoaded', () => {
        addFixedEffect()
        addDragDropEffect()
    })
})()