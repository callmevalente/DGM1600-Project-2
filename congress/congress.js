import { senators } from '../data/senators.js'
import { representatives } from '../data/representatives.js'
import { removeChildren } from '../swdb/tools/index.js'

const members = [...senators, ...representatives]

const memberDiv = document.querySelector('.members')
const loyaltyHeading = document.querySelector('.mostLoyal')
const seniorBox = document.querySelector('.seniority')
const chadBox = document.querySelector('.leastLoyal')
const theNav = document.querySelector('.buttons')

const allButton = document.createElement('button')
allButton.textContent = 'All'
const senButton = document.createElement('button')
senButton.textContent = 'Senators'
const reprButton = document.createElement('button')
reprButton.textContent = 'Representatives'
const repuButton = document.createElement('button')
repuButton.textContent = 'Republicans'
const demButton = document.createElement('button')
demButton.textContent = 'Democrats'

allButton.classList.add("button")
allButton.classList.add("is-link")
senButton.classList.add("button")
senButton.classList.add("is-success")
reprButton.classList.add("button")
reprButton.classList.add("is-warning")
repuButton.classList.add("button")
repuButton.classList.add("is-danger")
demButton.classList.add("button")
demButton.classList.add("is-info")

theNav.appendChild(allButton)
theNav.appendChild(senButton)
theNav.appendChild(reprButton)
theNav.appendChild(repuButton)
theNav.appendChild(demButton)

allButton.addEventListener('click', () => populateMemberDiv(SimplifiedMembers()))
senButton.addEventListener('click', () => populateMemberDiv(SimplifiedMembers('Sen.')))
reprButton.addEventListener('click', () => populateMemberDiv(SimplifiedMembers('Rep.')))
repuButton.addEventListener('click', () => populateMemberDiv(SimplifiedParty('R')))
demButton.addEventListener('click', () => populateMemberDiv(SimplifiedParty('D')))
function SimplifiedParty(chamberFilter) {
    const filteredArray = members.filter((member) =>
        chamberFilter ? member.party === chamberFilter : member,
    )

    return filteredArray.map((member) => {
        let middleName = member.middle_name ? ` ${member.middle_name} ` : ` `
        return {
            id: member.id,
            pic_id: member.govtrack_id,
            name: `${member.first_name}${middleName}${member.last_name}`,
            party: member.party,
            gender: member.gender,
            seniority: +member.seniority,
            imgURL: `https://www.govtrack.us/static/legislator-photos/${member.govtrack_id}-200px.jpeg`,
            missedVotesPct: member.missed_votes_pct,
            loyaltyPct: member.votes_with_party_pct,
        }
    })
}

function SimplifiedMembers(chamberFilter) {
    const filteredArray = members.filter((member) =>
        chamberFilter ? member.short_title === chamberFilter : member,
    )

    return filteredArray.map((member) => {
        let middleName = member.middle_name ? ` ${member.middle_name} ` : ` `
        return {
            id: member.id,
            pic_id: member.govtrack_id,
            name: `${member.first_name}${middleName}${member.last_name}`,
            party: member.party,
            gender: member.gender,
            seniority: +member.seniority,
            imgURL: `https://www.govtrack.us/static/legislator-photos/${member.govtrack_id}-200px.jpeg`,
            missedVotesPct: member.missed_votes_pct,
            loyaltyPct: member.votes_with_party_pct,
        }
    })
}

function populateMemberDiv(simpleMembers) {
    removeChildren(memberDiv)
    simpleMembers.forEach((member) => {
        const memFigure = document.createElement('figure')
        const figImg = document.createElement('img')
        const figCaption = document.createElement('figcaption')

        figImg.src = member.imgURL
        figCaption.textContent = member.name

        memFigure.appendChild(figImg)
        memFigure.appendChild(figCaption)
        memberDiv.appendChild(memFigure)
    })
}

const mostLoyal = SimplifiedMembers().reduce((acc, member) => {
    if (member.loyaltyPct === 100) {
        acc.push(member)
    }
    return acc
}, [])

const sheepList = document.createElement('ol')

const spineless = mostLoyal.map((sheep) => {
    let listItem = document.createElement('li')
    listItem.textContent = sheep.name
    sheepList.appendChild(listItem)
})

loyaltyHeading.appendChild(sheepList)

const theGigaChad = SimplifiedMembers().reduce((acc, member) =>
    acc.loyaltyPct < member.loyaltyPct ? acc : member,
)

const theChadPerc = 100 - theGigaChad.loyaltyPct

const chadFigure = document.createElement('figure')
const chadImg = document.createElement('img')
const chadCaption = document.createElement('figcaption')
const chadPerc = document.createElement('h1')
const chadPercText = document.createTextNode(`He voted against his party ${theChadPerc.toFixed(2)}% of the time.`)

chadImg.src = `https://www.govtrack.us/static/legislator-photos/${theGigaChad.pic_id}.jpeg`
chadCaption.textContent = theGigaChad.name

chadFigure.appendChild(chadImg)
chadFigure.appendChild(chadCaption)
chadBox.appendChild(chadFigure)
chadPerc.appendChild(chadPercText)
chadBox.appendChild(chadPerc)


const mostSeniorMember = SimplifiedMembers().reduce((acc, member) =>
    acc.seniority > member.seniority ? acc : member,
)

const seniorHead = document.createElement("h1")
const seniorHeadText = document.createTextNode('The most Senior member in congress is:');
const seniorTime = document.createElement("h1")
const seniorTimeText = document.createTextNode(`Who has been in congress for ${mostSeniorMember.seniority} years.`);
const seniorFigure = document.createElement('figure')
const seniorImg = document.createElement('img')
const seniorCaption = document.createElement('figcaption')

seniorImg.src = `https://www.govtrack.us/static/legislator-photos/${mostSeniorMember.pic_id}.jpeg`
seniorCaption.textContent = mostSeniorMember.name

seniorHead.appendChild(seniorHeadText)
seniorBox.appendChild(seniorHead)
seniorFigure.appendChild(seniorImg)
seniorFigure.appendChild(seniorCaption)
seniorBox.appendChild(seniorFigure)
seniorTime.appendChild(seniorTimeText)
seniorBox.appendChild(seniorTime)

populateMemberDiv(SimplifiedMembers())