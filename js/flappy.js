function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className // poderia usar o classList
    return elem
}


function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const border = newElement('div', 'border')
    const body = newElement('div', 'body')
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = (height) => // function to set the height of the barrier body
        body.style.height = `${height}px`
}



function PairBarriers(height, opening, x) {
    this.element = newElement('div', 'pair-of-barriers')

    this.upper = new Barrier(true) // it's reverse
    this.bottom = new Barrier(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.bottom.element)

    this.sortOpening = () => {
        const upperHeight = Math.random() * (height - opening)
        const bottomHeight = height - opening - upperHeight
        this.upper.setHeight(upperHeight)
        this.bottom.setHeight(bottomHeight)

    }

    this.getX = () =>  // current position
        parseInt(this.element.style.left.split('px')[0]) // transforming it to integer and getting only the number (the 1st part of the array)
    

    this.setX = x => 
        this.element.style.left = `${x}px`
    
    this.getWidth = () => 
        this.element.clientWidth
    

    this.sortOpening()
    this.setX(x)


}




function Barriers(height, width, opening, space, notifyPoint) {
    this.pairs = [
        new PairBarriers(height, opening, width),
        new PairBarriers(height, opening, width + space),
        new PairBarriers(height, opening, width + space * 2),
        new PairBarriers(height, opening, width + space * 3)


    ]

    const displacement = 3

    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement)


            //quando o elemento sair da tela...
            if (pair.getX() < -pair.getWidth()) {
                // seta um novo valor para posicao
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.sortOpening()
            }

            const middle = width / 2
            const crossedTheMiddle = pair.getX() + displacement >= middle
                && pair.getX() < middle
            if (crossedTheMiddle) notifyPoint()
        })
    }


}

const barriers = new Barriers(400, 200 , 200, 400)
const gameArea = document.querySelector('[wm-flappy]')
barriers.pairs.forEach(pair => {
    gameArea.appendChild(pair.element)

})
setInterval(() => {
    barriers.animate()
}, 20)

