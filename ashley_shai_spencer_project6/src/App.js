import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';


// COMPONENTS
import Form from './components/Form';
import Poem from './components/Poem';
import Fridge from './components/Fridge';

class App extends Component {
  constructor() {
    super();
    this.state = {
      wordList: [],
      show: 'show',
      hide: 'hide',
      selectedWords: [],
    }
  }
  componentDidMount() {
    // setWordList()
    // console.log(this.state.wordList);
    if (this.state.wordList.length > 0) {
      // this.state.wordlist.map((word) => {
      //   console.log(word)
      // })
    }
  }

  passChildState = (key, val) => {
    // console.log(key, val)
    this.setState({
      [key]: val,
    })
  }

  render() {
    return (
<<<<<<< HEAD
      <div className="App">
        <div className="wrapper">
          <main>
            <section className="fridge-container">
              <h1>Magnetic Poetry</h1>
              <Form passChildState={this.passChildState} queryInput={this.state.queryInput} />
              <ul>
                {
                  this.state.selectedWords
                  ?
                  this.state.selectedWords.map((word)=>{
                    return(
                      <li onClick={this.removeFromFridge}>{word}</li>
                    )
                  }):
                  null
                }
              </ul>
            </section>
            <aside className="poem-dashboard">
              <button className="reset" onClick={this.resetPage}>Reset</button>
              <button className="share-poem">Share Poem</button>
              <section className="word-container">
                <ul className="word-list" id="word-list">
                  {/* map through the word choices array and create an li for each word  */}
                  {
                    this.state.wordList
                      ?
                      this.state.wordList.map((word) => {
                        return (
                          <li className={this.state.show} onClick={this.addToFridge}>{word}</li>
                        )
                      })
                      :
                      null
                  }
                </ul>
              </section>
=======
      <Router>
        <div className="App">
          <div className="wrapper">
            <main>

              <Route exact path="/" render={(props) =>
                <Form {...props} passChildState={this.passChildState} queryInput={this.state.queryInput} />
              }/>
>>>>>>> b683944a02ab1c166fc9ecaf25125877df87fe9e

              <Route exact path="/fridge" render={(props) =>
                <Fridge {...props} wordList={this.state.wordList} passChildState={this.passChildState}/>
              }/>

              <Route path="/poem"  render={(props) =>
                <Poem {...props} selectedWords={this.state.selectedWords}/>}
              />
            </main>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;