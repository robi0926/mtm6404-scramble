/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  'scramble', 'elephant', 'pyramid', 'dolphin', 'volcano',
  'blanket', 'cactus', 'lantern', 'compass', 'penguin',
  'thunder', 'captain'
]

const MAX_STRIKES = 3
const MAX_PASSES = 3

function App () {
  const [gameWords, setGameWords] = React.useState(() => JSON.parse(localStorage.getItem('gameWords')) || shuffle(words))
  const [points, setPoints] = React.useState(() => JSON.parse(localStorage.getItem('points')) || 0)
  const [strikes, setStrikes] = React.useState(() => JSON.parse(localStorage.getItem('strikes')) || 0)
  const [passes, setPasses] = React.useState(() => JSON.parse(localStorage.getItem('passes')) || MAX_PASSES)
  const [message, setMessage] = React.useState('')
  const [guess, setGuess] = React.useState('')
  const [scrambledWord, setScrambledWord] = React.useState(() => {
    const saved = JSON.parse(localStorage.getItem('gameWords')) || shuffle(words)
    return shuffle(saved[0])
  })

  React.useEffect(() => {
    localStorage.setItem('gameWords', JSON.stringify(gameWords))
  }, [JSON.stringify(gameWords)])

  React.useEffect(() => {
    localStorage.setItem('points', JSON.stringify(points))
  }, [points])

  React.useEffect(() => {
    localStorage.setItem('strikes', JSON.stringify(strikes))
  }, [strikes])

  React.useEffect(() => {
    localStorage.setItem('passes', JSON.stringify(passes))
  }, [passes])

  const currentWord = gameWords[0]
  const gameOver = strikes >= MAX_STRIKES || gameWords.length === 0

  function guessHandler (e) {
    setGuess(e.target.value)
  }

  function submitHandler (e) {
    e.preventDefault()
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1)
      setGameWords(gameWords.slice(1))
      setScrambledWord(shuffle(gameWords[1]))
      setMessage('Correct! Next word.')
    } else {
      setStrikes(strikes + 1)
      setMessage('Wrong, try again!')
    }
    setGuess('')
  }

  function passHandler () {
    if (passes > 0) {
      setPasses(passes - 1)
      setGameWords(gameWords.slice(1))
      setScrambledWord(shuffle(gameWords[1]))
      setMessage("You've passed. Next word.")
    }
  }

  function restartHandler () {
    const newWords = shuffle(words)
    setGameWords(newWords)
    setScrambledWord(shuffle(newWords[0]))
    setPoints(0)
    setStrikes(0)
    setPasses(MAX_PASSES)
    setMessage('')
    setGuess('')
  }

  if (gameOver) {
    return (
      <div>
        <h1>Welcome to Scramble</h1>
        <p>Points: {points} | Strikes: {strikes}</p>
        <p>Game Over!</p>
        <button onClick={restartHandler}>Play Again</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome to Scramble</h1>
      <p>Points: {points} | Strikes: {strikes}</p>
      <p>{scrambledWord}</p>
      <p>{message}</p>
      <form onSubmit={submitHandler}>
        <input type="text" value={guess} onChange={guessHandler} />
        <button type="submit">Guess</button>
      </form>
      <button onClick={passHandler}>Pass ({passes} remaining)</button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
