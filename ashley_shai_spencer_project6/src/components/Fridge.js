import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import firebase from './firebase';


// document.addEventListener("dragenter", function (event) {
//   // highlight potential drop target when the draggable element enters it
//   if (event.target.className == "dropzone") {
//     event.target.style.background = "purple";
//   }

// }, false);


class Fridge extends Component{
  constructor(props){
    super(props);
    this.state = {
      wordList: this.props.wordList,
      selectedWords: [],
    }
  }

  onDragStart = (ev, id) => {
    console.log('dragstart:', id);
    ev.dataTransfer.setData("id", id);
  }

  onDragOver = (ev) => {
    ev.preventDefault();
    // ev.target.
    if(ev.target.className == "dropzone") {
    ev.target.style.background = "purple";
  }
}

  onDrop = (ev, cat) => {
    let id = ev.dataTransfer.getData('id');
    ev.target.style.background = "";
    // console.log(ev, cat);

    if (cat == 'selectedWords') {
      const tempSelected = this.state.wordList.slice(0);
      console.log('onDrop:', id);
      const index = this.getIndexOfClicked(id, this.state.wordList)
      const removedWord = tempSelected.splice(index, 1);

      this.setState(prevState => ({
        selectedWords: [...prevState.selectedWords, removedWord[0]],
        wordList: tempSelected
      }))
    } else if (cat == 'wordList') {
      const tempSelected = this.state.selectedWords.slice(0);
      console.log('onDrop:', id);
      //get index of clicked word in the array
      const index = this.getIndexOfClicked(id, this.state.selectedWords)
      //remove that word from the array
      const removedWord = tempSelected.splice(index, 1);
      //update the state by adding new spliced array and pushing removed word to other array
      this.setState(prevState => ({
        wordList: [...prevState.wordList, removedWord[0]],
        selectedWords: tempSelected
      }));
    }

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
    // const clickedWord = clickedItem.innerHTML
    return array.indexOf(clickedItem);
  }

  sharePoem = (e) => {
    //check to see if there are words in the poem 
    console.log(this.state.selectedWords);
    if (this.state.selectedWords.length > 0) {
      
      this.setState({
        wordList: [],

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

  render() {
    return (
      <div className="clearfix">
        <h1>Le fridge</h1>
        <section className="fridge-container">
          <ul id="fridge-words" className="dropzone"
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e, "selectedWords")}>
            >
                        {
              this.state.selectedWords
                ?
                this.state.selectedWords.map((word, i) => {
                  return (
                    <li key={i}
                      id={word}
                      draggable
                      onDragStart={(e) => {
                        this.onDragStart(e, e.target.id)
                      }} className="show">{word}</li>
                  )
                }) :
                null
            }
          </ul>
        </section>
        <aside className="poem-dashboard">
          {/* <button className="reset" onClick={this.resetPage}>Reset</button>
                   
                    <Link to="/" >Back</Link> */}
          <button className="share-poem show" onClick={this.sharePoem}>Share Poem</button>
          <section className="word-container">
            <ul className="dropzone" id="word-list"
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => this.onDrop(e, "wordList")}>
              >
                            {/* map through the word choices array and create an li for each word  */}
              {
                this.state.wordList
                  ?
                  this.state.wordList.map((word, i) => {
                    return (
                      <li key={i}
                        id={word}
                        draggable
                        onDragStart={(e) => {
                          this.onDragStart(e, e.target.id)
                        }} className="show">{word}</li>
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