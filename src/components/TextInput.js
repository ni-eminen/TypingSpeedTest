import React from 'react'
import { useEffect, useState } from 'react';

const TextInput = (props) => {
    const [value, setValue] = useState("")
    const [label, setLabel] = useState("")

    if(props.label) setLabel(props.label)
  
    const onChange = event => {
      let written = event.target.value
      if(written.length < props.limit){
        setValue(written)
        props.set(written)
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
          style={{color:"white"}}
        />
      </div>
    )
  }

export default TextInput