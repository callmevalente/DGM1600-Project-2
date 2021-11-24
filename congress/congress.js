import { senators } from '../data/senators.js'
import { representatives } from '../data/representatives.js'

const members = [...senators, ...representatives]

const memberDiv = document.querySelector('.members')
const loyaltyHeading = document.querySelector('.mostLoyal')
const seniorBox = document.querySelector('.seniority')

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
            imgURL: `https://www.govtrack.us/static/legislator-photos/${member.govtrack_id}-100px.jpeg`,
            missedVotesPct: member.missed_votes_pct,
            loyaltyPct: member.votes_with_party_pct,
        }
    })
}

function populateMemberDiv(simpleMembers) {
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

const mostSeniorMember = SimplifiedMembers().reduce((acc, member) =>
    acc.seniority > member.seniority ? acc : member,
)

const seniorTime = document.createElement("h1")
const seniorTimeText = document.createTextNode(`Who has been in congress for ${mostSeniorMember.seniority} years.`);
const seniorHead = document.createElement("h1")
const seniorHeadText = document.createTextNode('The most Senior member in congress is:');
const seniorFigure = document.createElement('figure')
const figImg = document.createElement('img')
const figCaption = document.createElement('figcaption')

figImg.src = `https://www.govtrack.us/static/legislator-photos/${mostSeniorMember.pic_id}.jpeg`
figCaption.textContent = mostSeniorMember.name

seniorHead.appendChild(seniorHeadText)
seniorBox.appendChild(seniorHead)
seniorFigure.appendChild(figImg)
seniorFigure.appendChild(figCaption)
seniorBox.appendChild(seniorFigure)
seniorTime.appendChild(seniorTimeText)
seniorBox.appendChild(seniorTime)



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

populateMemberDiv(SimplifiedMembers())