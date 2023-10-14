/* eslint-disable react/prop-types */
import { useWindowSize } from '@uidotdev/usehooks'
import Confetti from 'react-confetti'

function Die(props) {
    const styles = {
        backgroundColor: props.held ? "dodgerblue" : "whitesmoke"
    }

    return (
        <div className="die-face" style={styles} onClick={props.hold}>
            <h2 className="die-num">{props.value}</h2>
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

