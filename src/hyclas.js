class hyclas {

  constructor(selector, options = undefined) {
    this.element = (typeof selector === 'string') ? document.querySelector(selector) : selector
    this.tags = []
    this.typeSelected = undefined
    
    if(options) {
      this.types = options.types
    }

    this.setPredictions()
    this.handleEvents()
  }

  getSelection (event) {

    if(!window.getSelection().toString().length) return
    const selection = window.getSelection().getRangeAt(0)
    const selectionStart = selection.startOffset
    const selectionEnd = selection.endOffset
    const selectionString = selection.toString().trim()

    if (selectionEnd === selectionStart || selectionString.length === 0 || this.tags.find(item => { return item.label === selectionString && item.type === this.typeSelected })) return

    let tag = this.createTagObject(selectionString, this.getTypeSelected())

    try {
      selection.surroundContents(this.createElementTag(tag))
      window.getSelection().removeAllRanges()
      this.addTag(tag)
    }
    catch (error) {
      console.log(`Wrong selection: ${error}`)
    }
  }

  setPredictions () {
    let types = this.types
    const FLAGS = {
      case: 'i',
      whitespace: 's'
    }
    
    types.forEach(type => {
      type.predictions.forEach(prediction => {
        let html = this.element.innerHTML
        let defaultFlags = ['g']
        let predictionMatch = Object.keys(prediction.match).filter(key => { return prediction.match[key] }).map(match => { return FLAGS[match] }).concat(defaultFlags).join('')

        Object.keys(FLAGS).forEach(key => {

        })

        const regex = new RegExp(`\\b${prediction.text}\\b`,predictionMatch)
        if (regex.test(html)) {
          let tag = this.createTagObject(prediction.text, type)
          let element = this.createElementTag(tag)
          
          this.element.innerHTML = html.replace(regex, element.outerHTML)
          this.addTag(tag)
        }
      })
    })
    this.tags.forEach(tag => {
      this.attachContextMenu(this.element.querySelector(`[data-tag-id="${tag.id}"]`))
    })
  }

  addTag (tag) {
    this.tags.push(tag)
    this.createEvent(tag)
  }

  createElementTag (tag) {
    let element = document.createElement("span")

    element.style.backgroundColor = tag.color
    element.setAttribute('data-tag-id', tag.id)
    element.innerHTML = tag.label
    
    this.attachContextMenu(element)

    return element
  }

  attachContextMenu (element) {
    element.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.removeTag(event)
    })
  }

  removeTag (event) {

    const element = event.target
    const tagId = element.getAttribute('data-tag-id')
    const parent = element.parentNode
    const tagIndex = this.tags.findIndex(tag => { return tag.id === tagId })

    this.tags.splice(tagIndex, 1)
    while (element.firstChild) parent.insertBefore(element.firstChild, element);
    try {
      parent.removeChild(element)
    }
    catch (error) {}
    
    this.removeEvent(this.tags[tagIndex])
  }

  setType (type) {
    this.typeSelected = type
    this.getSelection()
  }

  getTypeSelected () {
    return this.types.find(item => { return item.type === this.typeSelected })
  }

  createTagObject (text, type) {
    return {
      id: Math.random().toString(36).slice(2),
      label: text,
      type: type.type,
      color: type.color
    }
  }

  toJSON () {
    return { tags: this.tags }
  }

  handleEvents () {
    this.element.addEventListener('mouseup', (event) => { 
      if (this.typeSelected && event.button == 0)
        this.getSelection(event) 
    })
  }

  createEvent (tag) {
    var event = new Event('createTag', { detail: tag })
    this.element.dispatchEvent(event)
  }

  removeEvent (tag) {
    var event = new Event('removeTag', { detail: tag })
    this.element.dispatchEvent(event)
  }

}

export {
  hyclas
}