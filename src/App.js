import './GrayTheme.css';
import './TextInput.css';
import TypingGame from './components/TypingGame.js'
import TextInput from './components/TextInput'
import { useEffect, useState } from 'react';
import service from './services/typingGame'
import axios from 'axios'

//swap function for quicksort
const swap = (arr, i, j) => {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}



const partition = (arr, low, high) => {
  let pivot = arr[high].score
  let i = low-1

  for(let j = low; j <= high - 1; j++){
    if(arr[j].score < pivot){
      i++
      swap(arr, i, j)
    }
  }
  swap(arr, i + 1, high)
  return i + 1
}

const quicksort = (arr, low, high) => {
  if(low < high){
    let pi = partition(arr, low, high)
    quicksort(arr, low, pi - 1)
    quicksort(arr, pi + 1, high)
  }
}

const InputField = (props) => {

  if(props.limit == null) props.limit = Number.MAX_SAFE_INTEGER
  return(
    <div id="inputField">
      <h2>{props.title}</h2>
      <TextInput set={props.set} limit={props.limit}/>
    </div>
  )

}

const StartMenu = (props) => {
  const [name, setName] = useState('')
  return (
    <div id="startMenuWrapper"> 
      <InputField title="Name:" set={setName} limit={16}></InputField>
      <div className="button" onClick={() => {if(name.length > 0) {props.submit(name); props.continue()}}} tabIndex="0">
        <p>Start!</p>
      </div>
    </div>
  )
}

const ScoreBoard = (props) => {
  //TODO: props.scores is undefined at times
  if(props.scores) {  
    quicksort(props.scores, 0, props.scores.length - 1)
    props.scores.reverse()
  } else {
    props.scores = []
  }

  let i = 1

  return (
    <div id="scoreBoardWrapper" className="window">
      <table id="scoreboard">
        <tbody>
            <tr>
              <th>Place</th>
              <th>User</th>
              <th>Score</th>
            </tr>
            {props.scores.slice(1, 6).map(score => 
            <tr key={Math.random()}>
              <th>{i++}.</th>
              <th>{score.name}</th>
              <th>{score.score}</th>
            </tr>
            )}
          </tbody>
      </table>
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

const App = (props) => {
  const [view, setView] = useState("start") 
  const [scores, setScores] = useState()
  const [user, setUser] = useState("")
  const [score, setScore] = useState()

  useEffect(() => {
    document.title = "Typing Speed Test"
    const req = axios.get("https://typingspeedserver.herokuapp.com/api/scores")
        req.then(response => {
          console.log(response.data);
        setScores(response.data)
      })
  }, [])

  const submitName = (name) => {
    if(name === "") return
    setUser(name)
    console.log("playerName: ", name);
  }

  const saveScore = (score) => {
    let newScore = {
      name: user,
      score: score
    }
  
    console.log("axios.create", newScore);
    let request = service.create(newScore)
    request.then(returnedScore => {
      setScores([...scores, returnedScore])
    })
  }

  const endGame = (score) => {
    console.log("endgame called", score);
    setScore(score)
    setView('score')
    saveScore(score)
  }

  if(view === "start"){
      return (
        <>
        <StartMenu id="startMenu" submit={submitName} continue={() => {setView('game')}}></StartMenu>
        </>
      )
    }else if(view === "game" || view === "score"){
      return (
        <>    
          <div id="wrapper" style={{ padding: "10px" }}>
            <TypingGame className="typingGame" mode={view} gameEndFunction={endGame} timeLimit={60}/>
            <ScoreBoard scores={scores}></ScoreBoard>
          </div>
        </>
      )
    } 
  }


export default App;
