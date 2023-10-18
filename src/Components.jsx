/* eslint-disable react/prop-types */
import { useWindowSize } from '@uidotdev/usehooks'
import Confetti from 'react-confetti'
import { Die1, Die2, Die3, Die4, Die5, Die6 } from "./DiceComponents"

const diceComponentsMap = {
    1: Die1,
    2: Die2,
    3: Die3,
    4: Die4,
    5: Die5,
    6: Die6
}

// Render individual die
function Die(props) {

    // Style conditionally based on the value of held prop
    const styles = {
        boxShadow: props.held ? "inset 3px 5px 10px -5px rgba(30, 144, 255, 0.7)" : "3px 3px 7px 3px rgba(0, 20, 255, 0.6)"
    }

    // Create and return a random die based on the value prop
    const RandomDie = diceComponentsMap[props.value] || null
    return (
        <div className='dice' style={styles} onClick={() => props.hold(props.id)}>
            <RandomDie />
        </div>
    )
}

// Display confetti
function RunConfetti() {
    const { width, height } = useWindowSize()
    return (
        <Confetti
            width={width}
            height={height}
        />
    )
}

export { Die, RunConfetti }

