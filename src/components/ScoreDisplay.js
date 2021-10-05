import React from 'react'

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

  export default ScoreDisplay