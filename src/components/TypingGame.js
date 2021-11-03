import React from 'react'
import ScoreDisplay from './ScoreDisplay';
import TextInputGame from './TextInputGame'
import { useEffect, useState, useRef } from 'react';

let wordList = "I saw a tree and thought of you, or rather, thought of the way you see trees. I remembered when we walked through the Ramble in Central Park, a wild place in the center of a place wilder still, resplendent and emerald in the early summer sun. You stopped suddenly when you saw it. I remember how you cocked your head in appreciation, a tendril of hair escaped from behind your ear. You brushed it back with an unconscious hand.".replace(/,|\.|/g, "").toLowerCase()
wordList = wordList.split(" ")
let th = 0
  
  const WordDisplay = ({ words }) => {
    
    return (
      <div id="wordDisplayWrapper">
        <span className="firstWord">{words[0]} </span>
        {words.slice(1).map(word => <span key={Math.random()} className="word">{word} </span>)}
      </div>
    )
  }

const TimerDisplay = (props) => {
  const [time, setTime] = useState(props.timeLimit)

  useEffect(() => {
    if(props.started) {
      if(time <= 0) {
        props.end()
        return
      }
      const timer = time > 0 && setInterval(() => setTime(time - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [time, props.started])

  return (
    <div id="timer" className="window">
      <p>{time}</p>
    </div>
  )
}

const TypingGame = (props) => {
    const [words, setWords] = useState(wordList)
    const [typingSpeed, setTypingSpeed] = useState(0)
    const [score, setScore] = useState({
      wpm: 0,
      correctWords: 0,
      incorrectWords: 0
    })
    const [started, setStarted] = useState(false)

    const typingSpeedRef = useRef(typingSpeed)
    typingSpeedRef.current = typingSpeed
  
    const incrTypingSpeed = () => {
      let speed = typingSpeed
      speed++;
      setTypingSpeed(speed)
    }
  
    const decrTypingSpeed = () => {
      let s = typingSpeedRef.current
      s--
      setTypingSpeed(s)
    }
  
    const handleWordsChange = () => {
      let w = [...words]
      w.shift()
      setWords(w)
    }
  
    const typingSpeedChange = () => {
      incrTypingSpeed()
      setTimeout(() => {
        decrTypingSpeed()
      }, 1000);
    }
  
    useEffect(() => {
  
    }, [words])

    return (
        <div id="gameWrapper" style={{ maxWidth: "640px", margin: "10px auto" }}>
            <WordDisplay words={words}></WordDisplay>
            <div id="inputWrapper" style={{ margin: "10px auto" }}>
                <TextInputGame id="typingInput" setScore={setScore} score={score} onChange={() => {typingSpeedChange(); setStarted(true)}} handleChange={handleWordsChange} words={words} />
            </div>
            <TimerDisplay timeLimit={props.timeLimit} started={started} end={() => props.gameEndFunction(score.correctWords)}></TimerDisplay>
            <div id="stats">
                <ScoreDisplay value={60 * typingSpeed} header="real-time cpm"></ScoreDisplay>
                <ScoreDisplay value={(60 * typingSpeed)/5} header="wpm"></ScoreDisplay>
                <ScoreDisplay value={score.incorrectWords} header="incorrect words"></ScoreDisplay>
                <ScoreDisplay value={score.correctWords} header="correct words"></ScoreDisplay>
            </div>
        </div>
    )
}


export default TypingGame
