/* eslint-disable no-unused-vars */

import { nanoid } from "nanoid"
import { useEffect, useRef, useState } from "react"
import Modal from "react-modal"
import { Die, RunConfetti } from "./Components"

Modal.setAppElement("#root")

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: "2px groove dodgerblue",
    maxWidth: "500px",
    width: "100%",
    borderRadius: "7px",
    textAlign: "center",
    backgroundColor: "whitesmoke",
  },
}

function App() {

  const [dice, setDice] = useState(AllNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem("records")) || [])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const startTimeRef = useRef(null)

  console.log(records)

  useEffect(() => {
    const firstValue = dice[0].value
    const allHeld = dice.every(die => die.held)
    const allSameNum = dice.every(die => die.value === firstValue)
    if (allHeld && allSameNum) {
      setTenzies(true)
    }
  }, [dice])

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
      console.log(record)
      setRecords(prevRecords => ([record, ...prevRecords]))
    }

  }, [rollCount, tenzies])

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records))
  }, [records])

  useEffect(() => {
    let timeoutId
    if (tenzies) {
      timeoutId = setTimeout(() => { setModalIsOpen(true) }, 3000)
    }
    return () => clearTimeout(timeoutId)
  }, [tenzies])

  function getRandomDieValue() {
    return Math.ceil(Math.random() * 6)
  }

  function AllNewDice() {
    const newDiceArray = []
    for (let i = 0; i < 10; i++) {
      const die = { id: nanoid(), value: getRandomDieValue(), held: false }
      newDiceArray.push(die)
    }
    return newDiceArray
  }

  function holdDie(id) {
    setDice(prevDice => prevDice.map(die =>
      die.id === id ? { ...die, held: !die.held } : die
    ))
  }

  function rollDice() {
    if (!tenzies) {
      setDice(prevDice => prevDice.map(die =>
        die.held ? die : { ...die, value: getRandomDieValue() }
      ))
      setRollCount(prevCount => prevCount + 1)
    } else {
      setTenzies(false)
      setDice(AllNewDice())
      setRollCount(0)
    }
  }

  function readableDuration(duration) {
    let minutes = 0
    let seconds = duration / 1000
    if (seconds >= 60) {
      minutes = Math.round(seconds / 60)
      seconds = seconds % 60
    }

    return `${minutes} Mins ${seconds.toFixed(2)} Secs`
  }

  const gameRecords = records.map(record =>
    <div className="record" key={record.id}>
      Total rolls: {record.total_rolls} &nbsp; &nbsp; &nbsp;
      Duration: {readableDuration(record.duration)}
    </div>
  )

  const diceElements = dice.map(die =>
    (<Die key={die.id} {...die} hold={holdDie} />)
  )

  return (
    <main>
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
