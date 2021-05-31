//funcao para criacao de novos elementos
function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className // it could be used classList too
    return elem
}

// creating one barrier
class Barrier {
    constructor(reverse = false) {
        this.element = newElement('div', 'barrier')

        const border = newElement('div', 'border')
        const body = newElement('div', 'body')
        this.element.appendChild(reverse ? body : border)
        this.element.appendChild(reverse ? border : body)

        this.setHeight = (height) => // function to set the height of the barrier body
            body.style.height = `${height}px`
    }
}


// creating pair of barriers (upper and bottom)
class PairBarriers {
    constructor(height, opening, x) {
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

        this.getX = () => // current x position
            parseInt(this.element.style.left.split('px')[0]) // transforming it to integer and getting only the number (the 1st part of the array)


        this.setX = x => this.element.style.left = `${x}px`

        this.getWidth = () => this.element.clientWidth


        this.sortOpening()
        this.setX(x)


    }
}




class Barriers {
    constructor(height, width, opening, space, notifyPoint) {
        // creating 4 pairs of barriers to re-use them
        this.pairs = [
            new PairBarriers(height, opening, width),
            new PairBarriers(height, opening, width + space),
            new PairBarriers(height, opening, width + space * 2),
            new PairBarriers(height, opening, width + space * 3)
        ]

        const displacement = 3

        // that's responsible for only one step
        this.animate = () => {
            this.pairs.forEach(pair => {
                pair.setX(pair.getX() - displacement)


                //when the element doen't appear in the screen anymore...
                if (pair.getX() < -pair.getWidth()) {
                    // setting a new value to the position
                    pair.setX(pair.getX() + space * this.pairs.length) // the element goes to the end
                    pair.sortOpening()
                }

                const middle = width / 2
                const crossedTheMiddle = () => {
                    if (pair.getX() + displacement >= middle && pair.getX() < middle) {
                        return true
                    }
                    if (crossedTheMiddle)
                        notifyPoint()
                }
            })
        }


    }
}

// creating the bird
class Bird {
    constructor(gameHeight) {
        let flying = false

        this.element = newElement('img', 'bird')
        this.element.src = '../imgs/bird.png'

        this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
        this.setY = y => this.element.style.bottom = `${y}px`

        window.onkeydown = e => flying = true
        window.onkeyup = e => flying = false

        this.animate = () => {
            const newY = this.getY() + (flying ? 5 : -5)
            const maxHeight = gameHeight - this.element.clientWidth


            // setting the positions
            if (newY <= 0)
                this.setY(0)
            else if (newY >= maxHeight)
                this.setY(maxHeight)
            else
                this.setY(newY)


        }
        // the bird will start in the middle of the game
        this.setY(gameHeight / 2)

    }
}

const barriers = new Barriers(500 , 1200 , 200, 400)
const bird = new Bird(500)
const gameArea = document.querySelector('[wm-flappy]')
gameArea.appendChild(bird.element)
barriers.pairs.forEach(pair => {
    gameArea.appendChild(pair.element)

})
setInterval(() => {
    barriers.animate()
    bird.animate()
}, 20)



