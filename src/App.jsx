import { nanoid } from "nanoid"
import { useEffect, useRef, useState } from "react"
import Modal from "react-modal"
import { Die, RunConfetti } from "./Components"

// Bind the Modal with the app
Modal.setAppElement("#root")

const App = () => {
  const [dice, setDice] = useState(AllNewDice())
  const [tenzies, setTenzies] = useState(false)

  // Track how many rolls it takes to finish the game
  const [rollCount, setRollCount] = useState(0)

  // Retrieve game records from localStorage
  // Create a new empty array if none
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem("records")) || [])

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const startTimeRef = useRef(null)

  // Check if the game is won
  useEffect(() => {
    const firstValue = dice[0].value
    const allHeld = dice.every(die => die.held)
    const allSameNum = dice.every(die => die.value === firstValue)
    if (allHeld && allSameNum) {
      setTenzies(true)
    }
  }, [dice])

  // Track the number of rolls and duration of each game
  // Store them in the records state
  useEffect(() => {
    if (rollCount === 1) {
      startTimeRef.current = new Date()
    }
    if (tenzies) {
      const record = {
        id: nanoid(),
        total_rolls: rollCount,
        duration: new Date() - startTimeRef.current
      }
      setRecords(prevRecords => ([record, ...prevRecords]))
    }

  }, [rollCount, tenzies])

  // Store the records in the localStorage
  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records))
  }, [records])

  // Display the score 3 secs after the game ends
  useEffect(() => {
    let timeoutId
    if (tenzies) {
      timeoutId = setTimeout(() => { setModalIsOpen(true) }, 3000)
    }
    return () => clearTimeout(timeoutId)
  }, [tenzies])

  const getRandomDieValue = () => {
    return Math.ceil(Math.random() * 6)
  }

  // Create and return a new set of dice
  const AllNewDice = () => {
    const newDiceArray = []
    for (let i = 0; i < 10; i++) {
      const die = { id: nanoid(), value: getRandomDieValue(), held: false }
      newDiceArray.push(die)
    }
    return newDiceArray
  }

  // Change the value of held property of a die when clicked
  const holdDie = (id) => {
    setDice(prevDice => prevDice.map(die =>
      die.id === id ? { ...die, held: !die.held } : die
    ))
  }

  // If the game is won start a new one
  // Else update the dice and rollCount states
  const rollDice = () => {
    if (tenzies) {
      setTenzies(false)
      setDice(AllNewDice())
      setRollCount(0)
    } else {
      setDice(prevDice => prevDice.map(die =>
        die.held ? die : { ...die, value: getRandomDieValue() }
      ))
      setRollCount(prevCount => prevCount + 1)
    }
  }

  const readableDuration = (duration) => {
    let minutes = 0
    let seconds = duration / 1000
    if (seconds >= 60) {
      minutes = Math.round(seconds / 60)
      seconds = seconds % 60
    }

    return `${minutes} Mins ${seconds.toFixed(2)} Secs`
  }

  // Create HTML elements for displaying the game records 
  const gameRecords = records.map(record =>
    <div className="record" key={record.id}>
      Total rolls: {record.total_rolls} &nbsp; &nbsp; &nbsp;
      Duration: {readableDuration(record.duration)}
    </div>
  )

  // Create JSX elements for rendering the dice
  const diceElements = dice.map(die =>
    (<Die key={die.id} {...die} hold={holdDie} />)
  )

  return (
    <main>

      {/* Modal to display the game stats */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="customModal"
        overlayClassName="customOverlay"
        contentLabel="Stats"
      >
        <h2 className="modal-heading">Scores</h2>
        <div className="modal-content">{gameRecords}</div>
      </Modal>

      {/* Display confetti if the game is won */}
      {tenzies && <RunConfetti />}

      <h1 className="game-heading">TENZI Dice Game</h1>
      <h3 className="game-description">Press Roll to roll the dice. Click on a die to hold it. If you get all the dice same, you have won!</h3>
      <section className="container">
        {diceElements}
      </section>
      <button className="roll-button" onClick={rollDice}>{tenzies ? "Play Again" : "Roll"}</button>
    </main>
  )
}

export default App
