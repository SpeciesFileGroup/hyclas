class hyclas {

  constructor(selector, options = undefined) {
    this.element = (typeof selector === 'string') ? document.querySelector(selector) : selector
    this.tags = []
    this.typeSelected = undefined
    
    if(options) {
      this.types = options.types
    }
    this.handleEvents()
  }

  getSelection () {
  
    const selection = window.getSelection().getRangeAt(0)
    const selectionStart = selection.startOffset
    const selectionEnd = selection.endOffset
    const selectionString = selection.toString().trim()

    if (selectionEnd === selectionStart || selectionString.length === 0 || this.tags.find(item => { return item.label === selectionString && item.type === this.typeSelected })) return

    let tag = this.createTagObject(selectionString, selectionStart, selectionEnd)

    try {
      selection.surroundContents(this.createElementTag(tag))
      this.tags.push(tag)
    }
    catch {
      console.log("Wrong selection")
    }

    this.createEvent()
  }

  createElementTag(tag) {
    let element = document.createElement("span")
    element.style.backgroundColor = tag.color

    return element
  }

  setType (type) {
    this.typeSelected = type
    this.getSelection()
  }

  createTagObject (text, selectionStart, selectionEnd) {
    const TYPE = this.types.find(item => { return item.type === this.typeSelected })
    return {
      label: text,
      type: TYPE.type,
      color: TYPE.color,
      start: selectionStart,
      end: selectionEnd
    }
  }

  toJSON () {
    return { tags: this.tags }
  }

  handleEvents () {
    this.element.addEventListener('mouseup', (event) => { 
      if (this.typeSelected)
        this.getSelection(event) 
    })
  }

  createEvent (tag) {
    var event = new Event('createTag', { detail: tag })
    this.element.dispatchEvent(event)
  }
}

export {
  hyclas
}