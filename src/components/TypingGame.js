import React from 'react'
import ScoreDisplay from './ScoreDisplay';
import TextInputGame from './TextInputGame'
import retryImg from './../img/retry.png'
import { useEffect, useState, useRef } from 'react';

let wordList = "I saw a tree and thought of you, or rather, thought of the way you see trees. I remembered when we walked through the Ramble in Central Park, a wild place in the center of a place wilder still, resplendent and emerald in the early summer sun. You stopped suddenly when you saw it. I remember how you cocked your head in appreciation, a tendril of hair escaped from behind your ear. You brushed it back with an unconscious hand.".replace(/,|\.|/g, "").toLowerCase()
wordList = wordList.split(" ")
let realWordList = []

//Random int between [0, max[
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

for(let i = 0; i<300; i++) {
  realWordList.push(wordList[getRandomInt(wordList.length)])
}
  
  const WordDisplay = ({ words, idx, classes }) => {
    const [wordsArr, setWordsArr] = useState([])
    const currentWord = useRef(null)

    // console.log(currentWord.current);
    if(currentWord.current) {
      // currentWord.current.scrollIntoView(1,{ behavior: 'smooth', block: 'nearest', inline: 'start' })
      currentWord.current.parentNode.scrollTop = currentWord.current.offsetTop - 25
    }

    useEffect(() => {
      let arr = words.map((word, i) => <span className="word" key={i}>{word}</span>)
      setWordsArr(arr)
      console.log(wordsArr);
    }, []);
    
    return (
      <div id="wordDisplayWrapper">
         {words.map((word, i) => {
           if(i === idx){
            return (<span key={i} className={"currentWord"} ref={currentWord}>{word}</span>)
           } else {
             return (<span key={i} className={classes[i] || "word"}>{word}</span>)
           }
          }
         )}
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
    } else {
      setTime(props.timeLimit)
    }
  }, [time, props.started])

  return (
    <div id="timer" className="window">
      <p>{time}</p>
    </div>
  )
}

const TypingGame = (props) => {
    const [words, setWords] = useState(realWordList)
    const [typingSpeed, setTypingSpeed] = useState(0)
    const [score, setScore] = useState({
      wpm: 0,
      correctWords: 0,
      incorrectWords: 0
    })
    const [started, setStarted] = useState(false)
    const [idx, setIdx] = useState(0)
    const [classes, setClasses] = useState([])
    const [countdown, setCountdown] = useState(props.timeLimit)


    const typingSpeedRef = useRef(typingSpeed)
    typingSpeedRef.current = typingSpeed
  
    const restart = () => {
      setScore({
        wpm: 0,
        correctWords: 0,
        incorrectWords: 0
      })
      setStarted(false)
      setIdx(0)
      setClasses([])
      setCountdown(props.timeLimit)
    }

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
      let i = idx + 1
      let w = [...words]
      setIdx(i)
      setWords(w)
    }
  
    const typingSpeedChange = () => {
      incrTypingSpeed()
      setTimeout(() => {
        decrTypingSpeed()
      }, 1000);
    }

    const updateClasses = (correct) => {
      let tempClasses = classes.slice()
      correct ? tempClasses.push("correctWord") : tempClasses.push("wrongWord")
      setClasses(tempClasses)
    }
  
    useEffect(() => {
  
    }, [words])

    return (
        <div id="gameWrapper" style={{ maxWidth: "640px", margin: "10px auto" }}>
            <WordDisplay words={words} idx={idx} classes={classes}></WordDisplay>
            <div id="inputWrapper" style={{ margin: "10px auto" }}>
                <TextInputGame id="typingInput" idx={idx} setScore={setScore} updateClasses={updateClasses} score={score} onChange={() => {typingSpeedChange(); setStarted(true)}} handleChange={handleWordsChange} words={words} />
                <div id="retryButton" className="button" onClick={restart}>
                  <img src={retryImg}></img>
                </div>
            </div>
            <TimerDisplay timeLimit={countdown} started={started} end={() => props.gameEndFunction(score.correctWords)}></TimerDisplay>
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
