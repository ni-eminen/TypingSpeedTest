import './GrayTheme.css';
import './TextInput.css';
import styled from 'styled-components'
import TypingGame from './components/TypingGame.js'
import TextInput from './components/TextInput'
import { useEffect, useState } from 'react';
import service from './services/typingGame'
import axios from 'axios'
import { nanoid } from 'nanoid'

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

const Button = styled.button`
  border: 0px solid black;
  background-color: RGB(232, 89, 12, .75);
  color: black;
  padding: 14px 28px;
  font-size: 16px;
  // opacity: .75;
  width: 100%;
  color: white;
  &:hover {
    background-color: RGB(232, 89, 12, 1);
  }
  `



const StartMenu = (props) => {
  const [name, setName] = useState('')

  const onClick = () => {
    if(name.length > 0) {props.submit(name); props.continue()}
  }

  return (
    <div id="startMenuWrapper"> 
      <InputField title="Name:" set={setName} limit={16}></InputField>
      <Button onClick={onClick}>
        Start!
      </Button>
    </div>
  )
}

const ScoreBoard = (props) => {
  //TODO: propsTypeError: Cannot assign to read only property 'scores' of object '#<Object>' at times
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
            {props.scores.slice(0, 6).map(score => 
            <tr key={nanoid()}>
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

// const BackgroundVideo = ({ videoSrc }) => {
//   return (
//     <div id="bgVideoWrap">
//       <video id="backgroundVideo" loop={true} autoPlay={true} muted={true}>
//         <source src={videoSrc} type="video/mp4" />
//       </video>
//     </div>
//   )
// }

const App = (props) => {
  const [mode, setMode] = useState("start") 
  const [scores, setScores] = useState([])
  const [user, setUser] = useState("")

  document.title = "Typing Speed Test"

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("https://typingspeedserver.herokuapp.com/api/scores")
      //   req.then(response => {
      //     console.log(response.data);
      //     setScores(response.data)
      // })
        setScores(response.data)
        console.log(response.data)
      } catch (err) {
        console.err(err.message)
      }
    }
    fetchPlayers()
  }, [])

  const updateMode = (newMode) => {
    setMode(newMode)
  }

  const submitName = (name) => {
    if(name === "") return
    setUser(name)
    console.log("playerName: ", name);
  }

  const saveScore = async (score) => {
    const newScore = {
      name: user,
      score: score
    }
  
    console.log("axios.create", newScore);
    const response = await service.create(newScore)
    // request.then(returnedScore => {
    //   setScores([...scores, returnedScore])
    // })
    setScores([...scores, response])
  }

  const endGame = (score) => {
    console.log("endgame called", score);
    // setScore(score)
    setMode('score')
    saveScore(score)
  }

  if(mode === "start"){
      return (
        <>
        <StartMenu id="startMenu" submit={submitName} continue={() => {setMode('game')}}></StartMenu>
        </>
      )
    }else if(mode === "game" || mode === "score"){
      return (
        <>    
          <div id="wrapper" style={{ margin: "0 10px" }}>
            <TypingGame setMode={() => updateMode} className="typingGame" mode={mode} gameEndFunction={endGame} timeLimit={60}/>
            <ScoreBoard scores={scores}></ScoreBoard>
          </div>
        </>
      )
    }
  }


export default App;
