import React from 'react';
import { Link } from 'react-router-dom';

const Poem = (props) => {
  console.log(props.selectedWords);

  return (
    <div>
      <h1>POEM SECTION</h1>
      <Link to="/" >Back</Link>
      <ul>
        {
          props.selectedWords.map((word) => {
            return(
              <li className="show">{word}</li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Poem;