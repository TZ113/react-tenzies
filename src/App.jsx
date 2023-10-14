/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react"
import { Die, RunConfetti } from "./Components"



function App() {

  const [allDice, setAllDice] = useState(AllNewDice())
  const [tenzies, setTenzies] = useState(false)

  useEffect(() => {
    const firstValue = allDice[0].value
    const allHeld = allDice.every(die => die.held)
    const allSameNum = allDice.every(die => die.value === firstValue)
    if (allHeld && allSameNum) {
      setTenzies(true)
    }
  }, [allDice])

  function getRandomDieValue() {
    return Math.ceil(Math.random() * 6)
  }

  function AllNewDice() {
    const newDiceArray = []
    for (let i = 0; i < 10; i++) {
      const num = getRandomDieValue()
      const die = { id: i + 1, value: num, held: false }
      newDiceArray.push(die)
    }
    return newDiceArray
  }

  function holdDie(id) {
    setAllDice(prevDice => prevDice.map(die =>
      die.id === id ? { ...die, held: !die.held } : die
    ))
  }

  function rollDice() {
    if (!tenzies) {
      setAllDice(prevDice => prevDice.map(die =>
        die.held ? die : { ...die, value: getRandomDieValue() }
      ))
    } else {
      setTenzies(false)
      setAllDice(AllNewDice())
    }
  }

  const diceElements = allDice.map(die =>
    (<Die key={die.id} {...die} hold={() => holdDie(die.id)} />)
  )

  return (
    <main>
      {tenzies && <RunConfetti />}
      <h1>TENZI Dice Game</h1>
      <h3>Press Roll to roll the dice. Click on a die to hold it. If you get all the dice same, you have won!</h3>
      <section className="container">
        {diceElements}
      </section>
      <button className="roll-button" onClick={rollDice}>{tenzies ? "Play Again" : "Roll"}</button>
    </main>
  )
}

export default App
