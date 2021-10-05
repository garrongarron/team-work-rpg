import erika from '../../characters/Erika/Erika'
import maw from '../../characters/Maw/Maw'
import erikaImg from '../../images/characters/Erika.png'
import mawImg from '../../images/characters/Maw.png'

const characterSelectorList = {
    'erika': {
        imgUrl: erikaImg,
        mesh: erika.getObject(),
        info: `<h2>Erika</h2>
        <div>
            <b>Strength:</b><i>Ranged attack</i>
        </div>
        <div>
            <b>Weakness:</b><i>Little resistance</i>
        </div>`
    },
    'maw': {
        imgUrl: mawImg,
        mesh: maw.getObject(),
        info: `
        <h2>Maw</h2>
    <div>
        <b>Strength:</b><i>Powerful attack</i>
    </div>
    <div>
        <b>Weakness:</b><i>Little Mobility</i>
    </div>`
    }
}

export default characterSelectorList