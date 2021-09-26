import react from 'react'
import { useEffect, useState, useRef } from 'react';
import correctSound from '../sounds/correct_bloop.mp3'
import incorrectSound from '../sounds/wrong_bloop.mp3'

let wordList = "I saw a tree and thought of you, or rather, thought of the way you see trees. I remembered when we walked through the Ramble in Central Park, a wild place in the center of a place wilder still, resplendent and emerald in the early summer sun. You stopped suddenly when you saw it. I remember how you cocked your head in appreciation, a tendril of hair escaped from behind your ear. You brushed it back with an unconscious hand.".replace(/,|\.|/g, "").toLowerCase()
wordList = wordList.split(" ")
let str = "test , . test"
console.log(str.replace(/\.|,/g, ""));

const TextInput = (props) => {
    const [value, setValue] = useState("")
    const [label, setLabel] = useState("")
  
    const nextWord = () => {
      setValue("");
      props.handleChange()
    }
  
    const onChange = event => {
      let written = event.target.value
      if(written === " "){
        setValue("")
        return
      }
      props.onChange()
      let next = event.target.value[event.target.value.length - 1] === " "
      setValue(written)
      if (written === props.words[0] + " " && next) {
        new Audio(correctSound).play()
        nextWord()
        props.setScore({...props.score, correctWords: ++props.score.correctWords})
      } else if (next) {
        new Audio(incorrectSound).play()
        nextWord()
        props.setScore({...props.score, incorrectWords: ++props.score.incorrectWords})
      }
    }
  
    useEffect(() => {
  
    }, [props.words])
  
    return (
      <div className="field" style={{ margin: "10px auto" }}>
        <input
          id={props.id}
          type="text"
          value={value}
          placeholder={label}
          onChange={onChange}
          autoFocus={true}
        />
      </div>
    )
  }
  
  const BackgroundVideo = ({ videoSrc }) => {
    return (
      <div id="bgVideoWrap">
        <video id="backgroundVideo" loop={true} autoPlay={true} muted={true}>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    )
  }
  
  const ScoreDisplay = ({ header, value }) => {
    return (
      <div id="typingSpeed" style={{ textAlign: "center", height: "100%", backgroundColor: "rgb(108,95,152,0.7)", borderRadius: "5px", display: "inline-block", marginRight: "5px", width: "100%", color: "white" }}>
        <div className="block" id="header" style={{ height: "30%" }}>{header}</div>
        <div className="block" id="display" style={{ height: "70%" }}>
          <p style={{ verticalAlign: "center" }}>{value}</p>
        </div>
      </div>
    )
  }
  
  const WordDisplay = ({ words }) => {
    return (
      <div className="block" style={{ minHeight: "100px", maxHeight: "100px", backgroundColor: "rgb(108,95,152,0.5)", overflowY: "hidden" }}>
        <span className="firstWord">{words[0]} </span>
        {words.slice(1).map(word => <span key={Math.random()} className="word">{word} </span>)}
      </div>
    )
  }

const TypingGame = (props) => {
    const [words, setWords] = useState(wordList)
    const [typingSpeed, setTypingSpeed] = useState(0)
    const [typingSpeedDisplay, setTypingSpeedDisplay] = useState(0)
    const [score, setScore] = useState({
      wpm: 0,
      correctWords: 0,
      incorrectWords: 0
    })
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
                <TextInput setScore={setScore} score={score} onChange={typingSpeedChange} handleChange={handleWordsChange} words={words} />
            </div>
            <div id="scoreboard" className="block" style={{ backgroundColor: "rgb(108,95,152,0.5)", height: "100px", padding: "5px", display: "flex" }}>
                <ScoreDisplay value={60 * typingSpeed} header="real-time wpm"></ScoreDisplay>
                <ScoreDisplay value={typingSpeedDisplay} header="wpm"></ScoreDisplay>
                <ScoreDisplay value={score.incorrectWords} header="incorrect words"></ScoreDisplay>
            </div>
        </div>
    )
}


export default TypingGame
