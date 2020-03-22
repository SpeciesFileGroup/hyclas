class menuSelector {
  constructor(element, hyclas) {
    this.hyclas = hyclas
    this.element = element
    this.renderToolbar()
    this.handleEvents()
  }

  renderToolbar () {
    this.hyclas.types.forEach(item => {
      this.element.appendChild(this.createTypeButton(item))
    })
  }

  createTypeButton (item) {
    let button = document.createElement("button")
    button.innerHTML = item.type
    button.type = 'button'
    button.style.backgroundColor = item.color

    return button
  }

  handleEvents () {
    this.element.addEventListener('click', (event) => {
      if(event.target.type === 'button') {
        this.hyclas.setType(event.target.innerText)
      }
    })
  }

}

export {
  menuSelector
}