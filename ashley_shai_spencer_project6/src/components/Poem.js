import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from './firebase';

class Poem extends Component {
  constructor(){
    super()
    this.state = {
      poemArray = [],
    }
  }
  // console.log(props.selectedWords);
  componentDidMount = () => {
    const fullPath = this.props.location.pathname;
    const poemKey = fullPath.split('/')[2];
    console.log(poemKey);
    const dbRef = firebase.database().ref(`/${poemKey}`);
    console.log(dbRef);
    dbRef.once('value').then((snapshot) => {
      console.log(snapshot.val())
      poemArray = snapshot.val();
    })
    // this needs to be fixed
    this.setState({
      poemArray: poemArray;
    })
  }
 
  render() {
  return (
    <div>
      <h1>POEM SECTION</h1>
      <Link to="/" >Back</Link>
      <ul>
        { poemArray.length > 0 ?
          poemArray.map((word) => {
            console.log(word);
            return(
              <li className="show">{word}</li>
            )
          })
          : null
        }
      </ul>
    </div>
  )
}
}

export default Poem;