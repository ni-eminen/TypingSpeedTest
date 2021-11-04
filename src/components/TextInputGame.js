import React from 'react'
import { useEffect, useState } from 'react';
import correctSound from '../sounds/correct_bloop.mp3'
import incorrectSound from '../sounds/wrong_bloop.mp3'

const TextInputGame = (props) => {
    const [value, setValue] = useState("")
    const [label, setLabel] = useState("")
  
    if(props.label) setLabel(props.label)


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
      if (written === props.words[props.idx] + " " && next) {
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

export default TextInputGame