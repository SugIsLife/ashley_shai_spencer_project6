import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from './firebase';


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
    const dbRef = firebase.database().ref(`/${poemKey}`);
    dbRef.once('value').then((snapshot) => {
      console.log('getting snapshot')
      return (snapshot.val())
      // return poemArray = snapshot.val();
    }).then((data)=> {
      this.setState({
        poemArray: data,
      })
    })
  }

  makeYourOwn = () => {
    // this.props.history.push('/').then(window.location.reload());
    this.props.passChildState('wordList', []);
    console.log('clicked make your own')
    this.props.history.push('/');
    
  }

  render() {
  return (
    <section className="poem-page">
      <div className="fridge-container">
        <h1>POEM SECTION</h1>
        <button onClick={this.makeYourOwn}>Make Your Own</button>
        <ul>
          {this.state.poemArray.map( (data, i) => {
            return (
            <li className="show" key={i}> {data} </li>
            )}
          )}
        </ul>
      </div>
    </section>
  )
}
}

export default Poem;