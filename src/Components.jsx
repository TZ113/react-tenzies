/* eslint-disable react/prop-types */
import { useWindowSize } from '@uidotdev/usehooks'
import Confetti from 'react-confetti'

function Die({ value, held, hold }) {
    const styles = {
        backgroundColor: held ? "dodgerblue" : "whitesmoke"
    }

    return (
        <div className="die-face" style={styles} onClick={hold}>
            <h2 className="die-num">{value}</h2>
        </div>
    )
}

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

