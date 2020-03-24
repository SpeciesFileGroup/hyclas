import { hyclas } from './hyclas'
import { menuSelector } from './menuSelector'

const element = document.querySelector('#test')
const elementToolbar = document.querySelector('#toolbar')

const options = {
  types: [
    {
      type: 'Date',
      color: 'green',
      predictions: ['21.iii.2020']
    },
    {
      type: 'Collector',
      color: 'yellow'
    },
    {
      type: 'Country',
      color: 'red'
    }
  ]
}

var lib = new hyclas(element, options)
var toolBar = new menuSelector(elementToolbar, lib)

element.addEventListener('createTag', () => {
  document.querySelector('#json').innerHTML = JSON.stringify(lib.toJSON(), null, 2)
})

element.addEventListener('removeTag', () => {
  document.querySelector('#json').innerHTML = JSON.stringify(lib.toJSON(), null, 2)
})