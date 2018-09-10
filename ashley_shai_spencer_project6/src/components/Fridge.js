import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
// import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import firebase from './firebase';

var dragged;

/* events fired on the draggable target */
document.addEventListener("drag", function (event) {
  // console.log('drag event')
  // console.log(event);
}, false);

document.addEventListener("dragstart", function (event) {
  // store a ref. on the dragged elem
  dragged = event.target;
  // make it half transparent
  event.target.style.opacity = .5;
}, false);

document.addEventListener("dragend", function (event) {
  // reset the transparency
  event.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function (event) {
  // prevent default to allow drop
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function (event) {
  // highlight potential drop target when the draggable element enters it
  if (event.target.className === "dropzone") {
    event.target.style.background = "#FE0046";
  }

}, false);

document.addEventListener("dragleave", function (event) {
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className === "dropzone") {
    event.target.style.background = "";
  }

}, false);

document.addEventListener("drop", function (event) {
  // prevent default action (open as link for some elements)
  event.preventDefault();
  // move dragged elem to the selected drop target
  if (event.target.className === "dropzone") {
    event.target.style.background = "";
    console.log(event.target);
    dragged.parentNode.removeChild(dragged);
    event.target.appendChild(dragged);
  }

}, false);

const onDragStart = (event) => {
  event.dataTransfer.setData('text/plain', null)
}

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

  // addToFridge = (e) => {
  //   // const wordList = e.target.parentElement.id
  //   const tempSelected = this.state.wordList.slice(0);
  //   const index = this.getIndexOfClicked(e.target, this.state.wordList)
  //   const removedWord = tempSelected.splice(index, 1);

  //   this.setState(prevState => ({
  //     selectedWords: [...prevState.selectedWords, removedWord[0]],
  //     wordList: tempSelected
  //   }))
  // }

  // removeFromFridge = (e) => {
  //   //on click on li, remove item from selectedWords array and put in wordList array
  //   // copy selectedWords
  //   const tempSelected = this.state.selectedWords.slice(0);
  //   //get index of clicked word in the array
  //   const index = this.getIndexOfClicked(e.target, this.state.selectedWords)
  //   //remove that word from the array
  //   const removedWord = tempSelected.splice(index, 1);
  //   //update the state by adding new spliced array and pushing removed word to other array
  //   this.setState(prevState => ({
  //     wordList: [...prevState.wordList, removedWord[0]],
  //     selectedWords: tempSelected
  //   }));
  // }

  getIndexOfClicked = (clickedItem, array) => {
    const clickedWord = clickedItem.innerHTML
    return array.indexOf(clickedWord);
  }

  sharePoem = (e) => {
    //check to see if there are words in the poem 
    const fridgeWords = document.getElementById('fridge-words').childNodes
    const selectedWords = Object.entries(fridgeWords).map((item) => {
      return item[1].innerHTML
    })
    if (selectedWords.length > 0) {
      

      this.setState({
        wordList: [],
        selectedWords
      }, () => {
        console.log('fridge state set')
        const dbRef = firebase.database().ref();
        this.props.passChildState("selectedWords", this.state.selectedWords)
        this.props.passChildState("wordList", [])
        console.log(this.state.selectedWords);
        
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
          <ul id="fridge-words" className="dropzone">
            {
              this.state.selectedWords
                ?
                this.state.selectedWords.map((word, i) => {
                  return (
                    <li id="draggable" draggable={true} onDragStart={onDragStart} className="show" key={i}>{word}</li>
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
            <ul className="dropzone" id="word-list">
              {/* map through the word choices array and create an li for each word  */}
              {
                this.state.wordList
                  ?
                  this.state.wordList.map((word, i) => {
                    return (
                      <li className="show" key={i}  id="draggable" draggable={true} onDragStart={onDragStart}>{word}</li>
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