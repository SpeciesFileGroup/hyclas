import { hyclas } from './hyclas'
import { menuSelector } from './menuSelector'

const element = document.querySelector('#test')
const elementToolbar = document.querySelector('#toolbar')

const options = {
  types: [
    {
      type: 'Date',
      color: 'green',
      predictions: [
        {
          text: '21.iii.2020',
          match: {
            case: true
          }
        }
      ]
    },
    {
      type: 'Collector',
      color: 'yellow',
      predictions: [
        {
          text:'homer',
          match: {
            case: true
          }
        }
      ]
    },
    {
      type: 'Country',
      color: 'red',
      predictions: [
        { 
          text: 'USA',
          match: {
            case: true
          }
        }
      ]
    }
  ]
}

var lib = new hyclas(element, options)
var toolBar = new menuSelector(elementToolbar, lib)

document.querySelector('#json').innerHTML = JSON.stringify(lib.toJSON(), null, 2)

element.addEventListener('createTag', () => {
  document.querySelector('#json').innerHTML = JSON.stringify(lib.toJSON(), null, 2)
})

element.addEventListener('removeTag', () => {
  document.querySelector('#json').innerHTML = JSON.stringify(lib.toJSON(), null, 2)
})