import React, { Component } from 'react';
import axios from 'axios';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Contains the input value that will be used to make api call for suggestions
      queryInput: '',
      // Prototyping our array of returned suggestions
      autoSuggest: [],
      wordList: [],
    }
  }

  // function makes an api call for auto suggestions and returns a promise
  suggestionQuery = (input) => {
    return axios.get(`https://api.datamuse.com/sug?s=${input}`)
  }

  handleChange = (e) => {
    // To make this function generic, set the changed input's key to be its id and value to be its value.
    this.setState({
      [e.target.id]: e.target.value,
    })

    // On change && only if the target's id is the queryValue, query the api for suggestions using the event target's value as the input
    if (e.target.id === "queryInput") {
      this.suggestionQuery(e.target.value)
        .then(({ data }) => {
          // map over the suggestions, returning an array of just the words
          const autoSuggest = data.map((word) => {
            return word.word
          })
          // change state of our auto suggestions and make sure the every time a query is made, we reset our clicked suggestion
          this.setState({
            autoSuggest
          })
        })
    }

    if (e.target.type === "radio") {
      // console.log(e.target.checked)
      this.setState({
        queryInput: e.target.value,
        topicSelected: true,
      })
    }
  }

  // toggleRadio = (e) => {
  //   Object.entries(document.getElementsByTagName('input')).map(input => {
  //     if (input[1].type === "radio") {
  //       console.log(input[1].value, input[1].checked)
  //     }
  //     if (input[1].checked && input[1].value !== e.target.value) {
  //     }
  //   })

  //   if (this.state.topicSelected){
  //     e.target.checked = false;
  //     // e.target.setAttribute('checked', false)
  //     this.setState({
  //       topicSelected: false,
  //     })
  //   } else{
  //     e.target.checked = true;
  //     this.setState({
  //       topicSelected: true,
  //     }, () => {
  //       this.props.passChildState('wordList', this.state.wordList)
  //     })
  //   }
  // }

  getElementOnClick = (e) => {
    this.setState({
      queryInput: e.target.innerHTML,
    })
  }

  // Make an api call to get words from an input - returns a promise
  getWordsQuery = (queryType, input, num) => {
    return axios.get(`https://api.datamuse.com/words?${queryType}=${input}&max=${num}`)
  }

  // take our api calls, and format,collect and reduce the results to a single array
  getWordList = (queryType, num, ) => {
    return this.getWordsQuery(queryType, this.state.queryInput, num)
  }

  // make api calls, pass wordlist to state
  setWordList = () => {
    const wordList = []
    Promise.all([
      this.getWordList('ml', 20),
      this.getWordList('rel_trg', 10),
      this.getWordList('rel_jjb', 10),
    ]).then((res) => {
      res.map(({ data }) => {
        data.map(({ word }) => {
          wordList.push(word)
        })
      })

      this.setState({
        wordList,
      }, () => {
        this.props.passChildState('wordList', this.state.wordList)
      })
    })


  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setWordList()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input id="queryInput" onChange={this.handleChange} type="text" name="" value={this.state.queryInput} readOnly={this.state.topicSelected ? true : false} />
        {this.state.queryInput ?
          <ul>
            {
              this.state.autoSuggest.map((word, i) => {
                return (
                  <li onClick={this.getElementOnClick} key={i}>{word}</li>
                )
              })
            }
          </ul> : null}
        <fieldset className="category-options">
          <input onChange={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Love" id="love" />
          <label htmlFor="love"> Love </label>

          <input onChange={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Yoga" id="yoga" />
          <label htmlFor="yoga"> Yoga </label>

          <input onChange={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Astrology" id="astrology" />
          <label htmlFor="astrology"> Astrology </label>

          <input onChange={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Apocalypse" id="apocalypse" />
          <label htmlFor="apocalypse"> Apocalypse </label>

          <input onChange={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Shakespeare" id="shakespeare" />
          <label htmlFor="shakespeare"> Shakespeare </label>

        </fieldset>
        <input type="submit" value="Give me Words" id="" />
      </form>
    )
  }
}

export default Form;