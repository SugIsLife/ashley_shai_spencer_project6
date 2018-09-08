import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import firebase from './firebase';

class Fridge extends Component{
  constructor(props){
    super(props);
    this.state = {
      wordList: this.props.wordList,
      selectedWords: [],
    }
  }

  componentDidMount() {
    // console.log(this.state.wordList);
  }

  addToFridge = (e) => {
    // const wordList = e.target.parentElement.id
    const tempSelected = this.state.wordList.slice(0);
    const index = this.getIndexOfClicked(e.target, this.state.wordList)
    const removedWord = tempSelected.splice(index, 1);

    this.setState(prevState => ({
      selectedWords: [...prevState.selectedWords, removedWord[0]],
      wordList: tempSelected
    }))
  }

  removeFromFridge = (e) => {
    //on click on li, remove item from selectedWords array and put in wordList array
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

    return array.indexOf(clickedWord);
  }

  sharePoem = (e) => {
    //check to see if there are words in the poem 
    if (this.state.selectedWords.length > 0) {
      this.props.passChildState("selectedWords", this.state.selectedWords)

      this.props.passChildState("wordList", [])

      this.setState({
        wordList: [],
      }, () => {
        console.log('fridge state set')
        const dbRef = firebase.database().ref();
        const poemKey = dbRef.push(this.state.selectedWords).key;
        //update URL path to go to poem component 
        this.props.history.push(`/poem/${poemKey}`)
      })
          
    // pass selected words to firebase
    
    } else {
      alert('why are you sharing an empty poem?!')
    }

  }

  resetPage = () => {
    window.location.reload();
  }

  render(){
    return (
      <div className="clearfix">
        <h1>Le fridge</h1>
        <section className="fridge-container">
          <ul>
            {
              this.state.selectedWords
                ?
                this.state.selectedWords.map((word, i) => {
                  return (
                    <li className="show" key={i} onClick={this.removeFromFridge}>{word}</li>
                  )
                }) :
                null
            }
          </ul>
        </section>
        <aside className="poem-dashboard">
          <button className="reset" onClick={this.resetPage}>Reset</button>
          <button className="share-poem show" onClick={this.sharePoem}>Share Poem</button>
          <Link to="/" >Back</Link>
          <section className="word-container">
            <ul className="word-list" id="word-list">
              {/* map through the word choices array and create an li for each word  */}
              {
                this.state.wordList
                  ?
                  this.state.wordList.map((word, i) => {
                    return (
                      <li className="show" key={i} onClick={this.addToFridge}>{word}</li>
                    )
                  })
                  :
                  null
              }
            </ul>
          </section>
        </aside>
      </div>
    )
  }
}


export default Fridge;