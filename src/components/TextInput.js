import React from 'react'
import { useEffect, useState, useRef } from 'react';
import correctSound from '../sounds/correct_bloop.mp3'
import incorrectSound from '../sounds/wrong_bloop.mp3'

const TextInput = (props) => {
    const [value, setValue] = useState("")
    const [label, setLabel] = useState("")
  
    const onChange = event => {
      let written = event.target.value
      setValue(written)
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

export default TextInput