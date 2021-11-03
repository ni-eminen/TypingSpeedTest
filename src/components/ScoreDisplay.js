import React from 'react'

const ScoreDisplay = ({ header, value }) => {
    return (
      <div className="scoreDisplay">
        <div className="block" id="header" style={{ height: "30%" }}>{header}</div>
        <div className="block" id="display" style={{ height: "70%" }}>
          <p style={{ verticalAlign: "center" }}>{value}</p>
        </div>
      </div>
    )
  }

  export default ScoreDisplay