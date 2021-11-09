import { people } from "../data/people.js"
import { getLastNumber, removeChildren } from "../tools/index.js"

const mainContent = document.querySelector('#main')

const maleCharacters = people.filter((person) => person.gender === 'male')
const femaleCharacters = people.filter((person) => person.gender === 'female')
const otherCharacters = people.filter((person) => {
  if (
    person.gender !== 'male' &&
    person.gender !== 'female' 
  ) {
    return person
  }
})

const header = document.createElement('header')

const allButton = document.createElement('button')
allButton.textContent = 'All Characters'
const femaleButton = document.createElement('button')
femaleButton.textContent = 'Female Characters'
const maleButton = document.createElement('button')
maleButton.textContent = 'Male Characters'
const othersButton = document.createElement('button')
othersButton.textContent = 'Other Characters'

populateDOM(people)

allButton.addEventListener('click', () => populateDOM(people))
femaleButton.addEventListener('click', () => populateDOM(femaleCharacters))
maleButton.addEventListener('click', () => populateDOM(maleCharacters))
othersButton.addEventListener('click', () => populateDOM(otherCharacters))

header.appendChild(allButton)
header.appendChild(femaleButton)
header.appendChild(maleButton)
header.appendChild(othersButton)


document.body.insertBefore(header, mainContent)

function populateDOM(characters) {
  removeChildren(mainContent)
  characters.forEach((element) => {
    const charFigure = document.createElement('figure')
    const charImg = document.createElement('img')
    const charNum = getLastNumber(element.url)
    charImg.src = `https://starwars-visualguide.com/assets/img/characters/${charNum}.jpg`

    const charCaption = document.createElement('figcaption')
    charCaption.textContent = element.name

    charFigure.appendChild(charImg)
    charFigure.appendChild(charCaption)
    mainContent.appendChild(charFigure)
  })
}

