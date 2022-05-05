import { films } from '../../data/films.js'
import { getLastNumber } from '../../tools/index.js'

let movieList = document.querySelector('#movieList')

for (let i = 0; i < films.length; i++) {
  let figure = document.createElement('figure')
  let figImg = document.createElement('img')
  figImg.src = `https://starwars-visualguide.com/assets/img/films/${i + 1}.jpg`
  let figCaption = document.createElement('figcaption')


  const foundMovie = films.find(film => {
    const convertedString = parseInt(getLastNumber(film.url), 10)
    return convertedString === (i + 1)
  })

  figCaption.textContent = foundMovie.title

  figure.appendChild(figImg)
  figure.appendChild(figCaption)
  movieList.appendChild(figure)
}