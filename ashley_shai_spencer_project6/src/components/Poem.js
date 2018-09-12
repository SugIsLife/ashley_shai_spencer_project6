import React, { Component } from 'react';
import firebase from './firebase';
import OdeLogo from '../assets/odeLogo.svg';


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
      <header className="poem-header clearfix">
        <h1 className="poem-logo"><img src={OdeLogo} alt="An ode to magnetic fridge poems" className="logo" /></h1>
        <nav className="poem-nav clearfix">
          {/* <Link to="/" className="home-link">Home</ Link> */}
          <button className="make-own" onClick={this.makeYourOwn}>Make Your Own</button>
        </nav>
        <p>...an app that pays tribute to the magnetic poetry kits of your childhood</p>
      </header>
      <div className="fridge-container">
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