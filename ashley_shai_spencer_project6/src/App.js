import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


// COMPONENTS
import Form from './components/Form'

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

  renderThing = () => {
    return this.state.wordList.map((word) => {
      console.log(word);
    })
  }

  passChildState = (key, val) => {
    // console.log(key, val)
    this.setState({
      [key]: val,
    }, () => {
      // console.log(this.state.wordList);
    })
  }
  printWords = () => {
    this.state.wordlist ?
      this.state.wordList.map((word) => {
        console.log(word)
        // return word
      }) : null
  }

  addToFridge = (e) =>{
    const wordList = e.target.parentElement.id
    e.target.classList = "hide"
    console.log(e.target);
    const selectedWords = Array.from(this.state.selectedWords)
    selectedWords.push(e.target.innerHTML)
    this.setState({selectedWords},()=>{
      // console.log(this.state.selectedWords);
    })
    this.arrayComp(this.state.selectedWords, this.state.wordList)
    this.arrayThing(e.target)
  }
  arrayComp = (arr1, arr2) => {
    arr1.forEach((word) => {
      console.log(word)
      arr2.forEach((item) => {
        if(word === item){
          const index = arr2.indexOf(item)
          const arr = arr2.splice(index, 1)
          console.log(arr)
        }
      })
    })
  }
  arrayThing = (clickedItem) => {
    const selectedWord = clickedItem.innerHTML
    console.log(selectedWord);
    const indexOfWord = this.state.wordList.indexOf(selectedWord);
    console.log(indexOfWord);
  }

  resetPage = () =>{
    window.location.reload();
  }

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <main>
            <section className="fridge-container">
              <h1>Sug Fun!</h1>
              <Form passChildState={this.passChildState} queryInput={this.state.queryInput} />
              <ul>
                {
                  this.state.selectedWords
                  ?
                  this.state.selectedWords.map((word)=>{
                    return(
                      <li>{word}</li>
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

            </aside>

          </main>
        </div>
      </div>
    );
  }
}

export default App;