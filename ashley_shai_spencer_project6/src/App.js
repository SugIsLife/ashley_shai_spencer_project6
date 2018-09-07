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

  passChildState = (key, val) => {
    // console.log(key, val)
    this.setState({
      [key]: val,
    }, () => {
      // console.log(this.state.wordList);
    })
  }
  
  addToFridge = (e) =>{
    // const wordList = e.target.parentElement.id
    console.log('i am adding to the fridge!')
    console.log(e.target.innerHTML);
    // e.target.classList = "hide"
    // console.log(e.target);
    // const selectedWords = Array.from(this.state.selectedWords);
    // selectedWords.push(e.target.innerHTML)

    const tempSelected = this.state.wordList.slice(0);
    const index = this.getIndexOfClicked(e.target, this.state.wordList)
    const removedWord = tempSelected.splice(index, 1);
    console.log(removedWord);

    this.setState({
      selectedWords: [...this.state.selectedWords, removedWord[0]],
      wordList: tempSelected
    })

    
  }

  removeFromFridge = (e) => {
    //on click on li, remove item from selectedWords array and put in wordList array
    console.log('i am removing from the fridge!')
    console.log(e.target.innerHTML);
    // copy selectedWords
    const tempSelected = this.state.selectedWords.slice(0);
    //get index of clicked word in the array
    const index = this.getIndexOfClicked(e.target, this.state.selectedWords)
    //remove that word from the array
    const removedWord = tempSelected.splice(index, 1);
    //update the state by adding new spliced array and pushing removed word to other array
    this.setState(prevState => ({
      wordList: [...prevState.wordList, removedWord[0]],
      selectedWords: tempSelected
    }));
  }
 
  getIndexOfClicked = (clickedItem, array) => {
    const clickedWord = clickedItem.innerHTML
    
    // console.log(selectedWord);
    // const indexOfWord = array.indexOf(clickedWord);
    return array.indexOf(clickedWord);
    // console.log(indexOfWord);
  }

  sharePoem = (e) => {
    console.log(this.state.selectedWords);
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

            </aside>

          </main>
        </div>
      </div>
    );
  }
}

export default App;