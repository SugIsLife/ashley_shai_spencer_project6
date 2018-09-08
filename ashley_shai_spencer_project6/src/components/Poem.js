import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from './firebase';

let poemArray = [];
class Poem extends Component {
  constructor(){
    super()
    this.state = {
      poemArray: [],
    }
  }

  componentDidMount = () => {
    const fullPath = this.props.location.pathname;
    const poemKey = fullPath.split('/')[2];
    // console.log(poemKey);
    const dbRef = firebase.database().ref(`/${poemKey}`);
    // console.log(dbRef);
    dbRef.once('value').then((snapshot) => {
      console.log('getting snapshot')
      return (snapshot.val())
      // return poemArray = snapshot.val();
    }).then((data)=> {
      console.log(data);
      this.setState({
        poemArray: data,
      })
    })
  }
  render() {
  return (
    <div>
      <h1>POEM SECTION</h1>
      <Link to="/" >Make Your Own</Link>
      <ul>
        {this.state.poemArray.map( (data, i) => {
          return (
          <li className="show" key={i}> {data} </li>
          )}
        )}
      </ul>
    </div>
  )
}
}

export default Poem;