import React from 'react'
import ScoreDisplay from './ScoreDisplay';
import TextInputGame from './TextInputGame'
import { useEffect, useState, useRef } from 'react';
import { useSpring, animated, Transition } from 'react-spring'
import styled from 'styled-components'


//Random int between [0, max[
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const generateWordList = () => {
  let wordList = "I saw a tree and thought of you, or rather, thought of the way you see trees. I remembered when we walked through the Ramble in Central Park, a wild place in the center of a place wilder still, resplendent and emerald in the early summer sun. You stopped suddenly when you saw it. I remember how you cocked your head in appreciation, a tendril of hair escaped from behind your ear. You brushed it back with an unconscious hand.".replace(/,|\.|/g, "").toLowerCase()
  wordList = wordList.split(" ")
  let realWordList = []
  for(let i = 0; i<300; i++) {
    realWordList.push(wordList[getRandomInt(wordList.length)])
  }
  return realWordList
}

const WordDisplay = ({ words, idx, classes, mode }) => {
  const [wordsArr, setWordsArr] = useState([])
  const currentWord = useRef(null)

  useEffect(() => {
    let arr = words.map((word, i) => <span className="word" key={i}>{word}</span>)
    setWordsArr(arr)
    console.log(wordsArr);
  }, []);

    // console.log('does it even render', currentWord.current);
    if(currentWord.current) {
      // currentWord.current.scrollIntoView(1,{ behavior: 'smooth', block: 'nearest', inline: 'start' })
      currentWord.current.parentNode.scrollTop = currentWord.current.offsetTop - 15
    }
  
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

const Button = styled.button`
  height: 50px;
  width: 50px;
  margin: 13px auto;
  margin-left: 10px;
  background-color: rgba(188, 72, 0, 1);
  border-radius: 50%;
  border: 0px solid black;
  color: white;
  font-size: 2.5em;
  transition-duration: .05s

  &:hover {
    background-color: RGB(232, 89, 12, 1);
    cursor: pointer;
  }
  }
  `

  const AnimatedButton = (props) => {
    const [pressed, setPressed] = useState(false)

    const boop = useSpring(pressed ? {
      to: async (next, cancel) => {
        await next({ scale: .8 })
        await next({ scale: 1 })
      },
      from: { scale: 1 },
      config: {
        duration: 75
      }
    } : {
      from: {scale: 1}
    })

    return (
      <div>
        <animated.div style={boop} onClick={() => {props.onClick()}} >
          <Button onMouseDown={() => setPressed(true)} 
                  onClick={() => setPressed(false)} 
                  onMouseLeave={() => setPressed(false)}>↺</Button>
        </animated.div>
      </div>
    )
  }


const TypingGame = (props) => {
    const [words, setWords] = useState(generateWordList())
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
      console.log("restart called")
      setScore({
        wpm: 0,
        correctWords: 0,
        incorrectWords: 0
      })
      setStarted(false)
      setIdx(0)
      setClasses([])
      setCountdown(props.timeLimit)
      setWords(generateWordList())
      props.setMode('game')
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
        <div id="gameWrapper">
            <WordDisplay mode={props.mode} words={words} idx={idx} classes={classes}></WordDisplay>
            <div id="inputWrapper" style={{ margin: "10px auto" }}>
                <TextInputGame mode={props.mode} id="typingInput" idx={idx} setScore={setScore} updateClasses={updateClasses} score={score} onChange={() => {typingSpeedChange(); setStarted(true)}} handleChange={handleWordsChange} words={words} />
                <AnimatedButton onClick={restart}></AnimatedButton>
                {/* <Button onClick={restart}>↺</Button> */}
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
