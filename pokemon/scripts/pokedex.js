import { removeChildren } from '../../swdb/tools/index.js'

const showAll = document.querySelector('.showAll')

showAll.addEventListener('click', () => {
    removeChildren(pokeGrid)
    loadPokemon(0, 1118)
})

const modal = document.querySelector('.modal')
const closeButton = document.querySelector('.modal-close')
const modalBackground = document.querySelector('.modal-background')
const createButton = document.querySelector('.create')

modalBackground.addEventListener('click', () => modal.classList.toggle('is-active'))
closeButton.addEventListener('click', () => modal.classList.toggle('is-active'))

function getAPIData(url) {
    try {
        return fetch(url).then((data) => data.json())
    } catch (error) {
        console.error(error)
    }
}

loadPokemon()

function loadPokemon(offset = 0, limit = 50) {
    getAPIData(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`,
    ).then(async (data) => {
        for (const pokemon of data.results) {
            await getAPIData(pokemon.url).then((pokeData) =>
                populatePokeCard(pokeData),
            )
        }
    })
}

const pokeGrid = document.querySelector('.pokeGrid')
const loadButton = document.querySelector('.loadPokemon')
loadButton.addEventListener('click', () => {
    removeChildren(pokeGrid)
    loadPokemon()
})
const newButton = document.querySelector('.newPokemon')
newButton.addEventListener('click', () => {
    modal.classList.toggle('is-active')
})

createButton.addEventListener('click', () => {
    let pokeName = document.querySelector('#theName').value
    let pokeTypes = document.querySelector('#theType').value
    let pokeHeight = document.querySelector('#theHeight').value
    let pokeWeight = document.querySelector('#theWeight').value
    let newPokemon = new Pokemon(
        pokeName,
        pokeHeight,
        pokeWeight,
        getTypesArray(pokeTypes)
    )
    populatePokeCard(newPokemon)
    modal.classList.toggle('is-active')
})

const allPokemon = await getAllSimplePokemon()

const pokeFetch = document.querySelector('.pokeFetch')
pokeFetch.addEventListener('click', () => {
    let startPoint = document.querySelector('#iniId').value
    let howMany = document.querySelector('#pokeRange').value
    if (startPoint <= 898) {
        removeChildren(pokeGrid)
        loadPokemon(startPoint, howMany)
    } else if (startPoint >= 10001 && startPoint <= 10220) {
        startPoint -= 9103
        console.log(startPoint)
        removeChildren(pokeGrid)
        loadPokemon(startPoint, howMany)
    }
})

const runSearch = document.querySelector('.pokeSearchEx')

runSearch.addEventListener('click', () => {
    let entPokemon = document.querySelector("#entPoke").value
    if (/^\d+$/.test(entPokemon)) {
        let curePoke = getPokemonById(entPokemon)[0]
        populatePokeCard(curePoke)
    } else {
        let entPokemonOk = entPokemon.toLowerCase()
        populatePokeCard(getPokemonByName(entPokemonOk)[0])
    }
})

function getPokemonByName(serName) {
    return allPokemon.filter((pokemon) => pokemon.name == serName)
}

function getPokemonById(serId) {
    return allPokemon.filter((pokemon) => pokemon.id == serId)
}

function getTypesArray(commaString) {
    let tempArray = commaString.split(',')
    return tempArray.map((typeName) => {
        return {
            typeName,
        }
    })
}

async function getAllSimplePokemon() {
    const allPokemon = []
    await getAPIData(
        `https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0`,
    ).then(async (data) => {
        for (const pokemon of data.results) {
            await getAPIData(pokemon.url).then((pokeData) => {
                const mappedPokemon = {
                    abilities: pokeData.abilities,
                    height: pokeData.height,
                    id: pokeData.id,
                    name: pokeData.name,
                    types: pokeData.types,
                    weight: pokeData.weight,
                }
                allPokemon.push(mappedPokemon)
            })
        }
    })
    return allPokemon
}

function getAllPokemonByType(type) {
    return allPokemon.filter((pokemon) => pokemon.types[0].type.name == type || pokemon.types[1]?.type.name == type)
}

const filterButton = document.querySelector('.filterButton')
filterButton.addEventListener('click', () => {
    let typeToFilter = document.querySelector('#pokeTypeFilter').value
    filteringPokemon(typeToFilter)
})

function filteringPokemon(filteredType) {
    if (filteredType === '--Select--') {
        removeChildren(pokeGrid)
        loadPokemon()
    } else {
        let loweredFilteredType = filteredType.toLowerCase()
        removeChildren(pokeGrid)
        let thefilteredPokes = getAllPokemonByType(loweredFilteredType)
        thefilteredPokes.forEach((item) => populatePokeCard(item, loweredFilteredType))
    }
}


function populatePokeCard(singlePokemon, theType = 'default') {
    const pokeScene = document.createElement('div')
    pokeScene.className = 'scene'
    const pokeCard = document.createElement('div')
    pokeCard.className = 'pokeCard'
    pokeCard.addEventListener('click', () =>
        pokeCard.classList.toggle('is-flipped'),
    )
    const cFront = populateCardFront(singlePokemon, theType)
    const cBack = populateCardBack(singlePokemon)

    pokeCard.appendChild(cFront)
    pokeCard.appendChild(cBack)
    pokeScene.appendChild(pokeCard)
    pokeGrid.appendChild(pokeScene)
}

function populateCardFront(pokemon, theType) {
    const pokeFront = document.createElement('figure')
    pokeFront.className = 'cardFace cFront'
    const pokeImg = document.createElement('img')
    if (pokemon.id === 9001) {
        pokeImg.src = 'images/what.png'
    } else {
        pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
    }
    const pokeCaption = document.createElement('figcaption')
    pokeCaption.textContent = `${pokemon.name}`
    pokeFront.appendChild(pokeCaption)
    pokeFront.appendChild(pokeImg)

    typesBackground(pokemon, theType, pokeFront)

    return pokeFront
}

function typesBackground(pokemon, theType, card) {
    card.style.setProperty('background', getPokeTypeColor(theType))
}

function populateCardBack(pokemon) {
    const pokeBack = document.createElement('div')
    pokeBack.className = 'cardFace cBack'
    const miniPokePic = document.createElement('img')
    miniPokePic.className = 'backPic'
    if (pokemon.id === 9001) {
        miniPokePic.src = 'images/openpokeball.png'
    } else {
        miniPokePic.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    }
    const pokeStats = document.createElement('div')
    pokeStats.className = 'stats'
    const pokeId = document.createElement('h4')
    pokeId.textContent = `ID: ${pokemon.id}`
    const typeLabel = document.createElement('h4')
    typeLabel.textContent = 'Type(s):'
    const pokeTypes = document.createElement('ul')
    if (pokemon.id === 9001) {
        for (var i = 0; i < pokemon.types.length; i++) {
            let typeItem = document.createElement('li')
            typeItem.textContent = pokemon.types[i].typeName
            pokeTypes.appendChild(typeItem)
        }
    } else {
        pokemon.types.forEach((pokeType) => {
            let typeItem = document.createElement('li')
            typeItem.textContent = pokeType.type.name
            pokeTypes.appendChild(typeItem)
        })
    }
    const pokeHeight = document.createElement('h4')
    pokeHeight.textContent = `Height: ${pokemon.height}`
    const pokeWeight = document.createElement('h4')
    pokeWeight.textContent = `Weight: ${pokemon.weight}`
    pokeBack.appendChild(miniPokePic)
    pokeStats.appendChild(pokeId)
    pokeStats.appendChild(typeLabel)
    pokeStats.appendChild(pokeTypes)
    pokeStats.appendChild(pokeHeight)
    pokeStats.appendChild(pokeWeight)
    pokeBack.appendChild(pokeStats)
    return pokeBack
}

class Pokemon {
    constructor(name, height, weight, types, id = 9001) {
        ; (this.id = id),
            (this.name = name),
            (this.height = height),
            (this.weight = weight),
            (this.types = types)
    }
}

function getPokeTypeColor(pokeType) {
    let color
    switch (pokeType) {
        case 'normal':
            color = '#A8A77A'
            break
        case 'fire':
            color = '#EE8130'
            break
        case 'water':
            color = '#6390F0'
            break
        case 'electric':
            color = '#F7D02C'
            break
        case 'grass':
            color = '#7AC74C'
            break
        case 'ice':
            color = '#96D9D6'
            break
        case 'fighting':
            color = '#C22E28'
            break
        case 'poison':
            color = '#A33EA1'
            break
        case 'ground':
            color = '#E2BF65'
            break
        case 'flying':
            color = '#A98FF3'
            break
        case 'psychic':
            color = '#F95587'
            break
        case 'bug':
            color = '#A6B91A'
            break
        case 'rock':
            color = '#B6A136'
            break
        case 'ghost':
            color = '#735797'
            break
        case 'dragon':
            color = '#6F35FC'
            break
        case 'dark':
            color = '#705746'
            break
        case 'steel':
            color = '#B7B7CE'
            break
        case 'fairy':
            color = '#D685AD'
            break
        default:
            color = '#2a75bb'
    }
    return color
}