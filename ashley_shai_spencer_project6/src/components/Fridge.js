import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import firebase from './firebase';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: `5px`,
  margin: `2px`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#f1f1f1',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: `2px`,
  width: 250
});


class Fridge extends Component{
  constructor(props){
    super(props);
    this.state = {
      wordList: this.props.wordList,
      selectedWords: ['placeholder'],
    }
  }

  id2List = {
    droppable: 'selectedWords',
    droppable2: 'wordList'
  };

  //returns the correct array from state based on which list the item originated from 
  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;
    console.log('dragEnd:', result)

    // dropped outside the list
    if (!destination) {
      return;
    }

    //if source and destination are the same, reorder that list based on where the item was dropped 
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );
      //update state with new array order
      let state = { selectedWords: items };

      //if source is equal to droppable2 update selected items 
      if (source.droppableId === 'droppable2') {
        state = { wordList: items };
      }

      this.setState(state);
    } else {
      //if the source and destination are different the item needs to be moved between the two lists 
      const result = move(
        //where it is coming from
        this.getList(source.droppableId),
        //where it was dropped
        this.getList(destination.droppableId),
        source,
        destination
      );
      //reset with new info 
      this.setState({
        selectedWords: result.droppable,
        wordList: result.droppable2
      });
    }
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
  

  // resetPage = () => {
  //   window.location.reload();
  // }

  render() {
    return (
      <div className="clearfix">
        <h1>Le fridge</h1>
        <button className="share-poem show" onClick={this.sharePoem}>Share Poem</button>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <ul 
                id="fridge-words" 
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                  {
                  
                  this.state.selectedWords.map((item, index) => (
                  
                    <Draggable
                      key={item}
                      draggableId={item}
                      index={index}>
                      {(provided, snapshot) => (
                        <li 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          className="show">
                          {item}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <ul
                  id="word-list"
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {

                    this.state.wordList.map((item, index) => (
                      <Draggable
                        key={item}
                        draggableId={item}
                        index={index}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                            className="show">
                            {item}
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
        </DragDropContext>
      </div>
    )
  }
}


export default Fridge;