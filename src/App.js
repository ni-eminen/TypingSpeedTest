import './App.css';
import './TextInput.css';
import TypingGame from './components/TypingGame.js'
import { useEffect, useState, useRef } from 'react';
import sample from './videos/video.mp4'
import correctSound from './sounds/correct_bloop.mp3'
import incorrectSound from './sounds/wrong_bloop.mp3'

let wordList = "I saw a tree and thought of you, or rather, thought of the way you see trees. I remembered when we walked through the Ramble in Central Park, a wild place in the center of a place wilder still, resplendent and emerald in the early summer sun. You stopped suddenly when you saw it. I remember how you cocked your head in appreciation, a tendril of hair escaped from behind your ear. You brushed it back with an unconscious hand.".replace(/,|\.|/g, "").toLowerCase()
wordList = wordList.split(" ")

let scores = [
  {
    user: "matias",
    score: 400
  },{
    user: "roni",
    score: 300
  },{
    user: "pekka",
    score: 200
  },{
    user: "weerti",
    score: 100
  },{
    user: "osku",
    score: 50
  },{
    user: "mans",
    score: 1400
  }
]

const submitName = () => {
  
}


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

const StartMenu = (props) => {
  const [name, setName] = useState('')

  return (
    <div id="startMenuWrapper">
      <form onSubmit={submitName}>

      </form>
    </div>
  )
}

const ScoreBoard = (props) => {
  quicksort(scores, 0, scores.length - 1)
  scores.reverse()
  return (
    <div id="scoreBoardWrapper" className="window">
      <table id="scoreboard">
        <tr>
          <th>User</th>
          <th>Score</th>
        </tr>
        {scores.map(score => 
        <tr>
          <th>{score.user}</th>
          <th>{score.score}</th>
        </tr>
        )}
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
  const [view, setView] = useState("game") 

  if(view == "start"){
      return (
        <StartMenu></StartMenu>
      )
    }else if(view === "game"){
      return (
        <>
          <BackgroundVideo videoSrc={sample}></BackgroundVideo>
    
          <div id="wrapper" style={{ padding: "10px" }}>
            <TypingGame className="typingGame"/>
            <ScoreBoard></ScoreBoard>
          </div>
        </>
      )
    } 
  }


export default App;
