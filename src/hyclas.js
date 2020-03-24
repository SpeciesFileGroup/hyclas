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

  getSelection (event) {

    if(!window.getSelection().toString().length) return
    const selection = window.getSelection().getRangeAt(0)
    const selectionStart = selection.startOffset
    const selectionEnd = selection.endOffset
    const selectionString = selection.toString().trim()

    if (selectionEnd === selectionStart || selectionString.length === 0 || this.tags.find(item => { return item.label === selectionString && item.type === this.typeSelected })) return

    let tag = this.createTagObject(selectionString, selectionStart, selectionEnd)

    try {
      selection.surroundContents(this.createElementTag(tag))
      window.getSelection().removeAllRanges()
      this.tags.push(tag)
    }
    catch (error) {
      console.log(`Wrong selection: ${error}`)
    }

    this.createEvent()
  }

  createElementTag(tag) {
    let element = document.createElement("span")
    element.style.backgroundColor = tag.color
    element.setAttribute('data-tag-id', tag.id)
    
    element.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.removeTag(event)
    })

    return element
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

  createTagObject (text, selectionStart, selectionEnd) {
    const TYPE = this.types.find(item => { return item.type === this.typeSelected })
    return {
      id: Math.random().toString(36).slice(2),
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