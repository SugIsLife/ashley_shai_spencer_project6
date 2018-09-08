import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'underscore'

let wordList = ['or', 'if', 'the', 'a', 'it', 'does', 'they', 'their', 'his', 'her', 'and', 'our', 'out', 'we', 'in', 'to', 'too', 'me', 'ly', 'ing', 'd', 'ed', 'ful', 'y', 'anti', 'un', 're', '!', '?']

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
  
  componentDidMount() {
    console.log(this.state.wordList);
    // this.setState({
    //   wordList: []
    // })
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

  }

  toggleRadio = (e) => {
    // If a topic has been selected already and if e.target is a radio button...
    if (this.state.topicSelected && e.target.type === "radio" ){
      // uncheck the input
      e.target.checked = false

      // change state to reflect a topic being unselected
      this.setState({
        topicSelected: false,
        queryInput: '',
      })
    //  if a topic has not been selected...
    } else if (e.target.type === "radio" ){

      // set the input that was clicked to checked
      e.target.checked = true;

      // change state to reflect that a topic has been selected
      this.setState({
        topicSelected: true,
        queryInput: e.target.value,
      })
    }
  }

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

  getVerbs = (queryType, input, num) => {
    return axios.get(`https://api.datamuse.com/words?${queryType}=${input}&max=${num}&md=p`).then(({ data }) => {

      // filter for verbs
      const verbs = data.filter((word) => {
        return word.tags && word.tags.includes('v')

      })
      //get array of just the words
      // console.log(wordList)
      verbs.slice(0, 10).map((word) => {
        wordList.push(word.word)
      });
      // console.log(wordList)
      //add words to wordList
      // console.log(wordList.length)
      this.setState({
        wordList,
      }, () => {
        const shuffledWords = _.shuffle(wordList)
        this.props.passChildState('wordList', shuffledWords)
        this.props.history.push("/fridge")
      })
      // return verbList.word

    })
  }

  // make api calls, pass wordlist to state
  setWordList = () => {
    wordList = ['or', 'if', 'the', 'a', 'it', 'does', 'they', 'their', 'his', 'her', 'and', 'our', 'out', 'we', 'in', 'to', 'too', 'me', 'ly', 'ing', 'd', 'ed', 'ful', 'y', 'anti', 'un', 're', '!', '?']
    console.log(wordList);
    
    Promise.all([
      this.getWordList('ml', 15),
      this.getWordList('rel_trg', 10),
      this.getWordList('rel_jjb', 10),

    ]).then((res) => {
      res.map(({ data }) => {
        
        data.map(({ word }) => {
          
          wordList.push(word)
        })
      })
      this.getVerbs('ml', this.state.queryInput, '300')
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setWordList()
    this.setState({
      autoSuggest: [],
    })
  }

  render() {
    return (
      <section className="wrapper">
        <h1>Magnetic Poetry</h1>
        <form onSubmit={this.handleSubmit}>
          <input id="queryInput" onChange={this.handleChange} type="text" name="" value={this.state.queryInput} readOnly={this.state.topicSelected ? true : false} />
          {this.state.queryInput ?
            <ul>
              {
                this.state.autoSuggest.map((word, i) => {
                  return (
                    <li className="show" onClick={this.getElementOnClick} key={i}>{word}</li>
                  )
                })
              }
            </ul> : null}
          <fieldset className="category-options">
            <input onBlur={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Love" id="love" />
            <label htmlFor="love"> Love </label>

            <input onBlur={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Yoga" id="yoga" />
            <label htmlFor="yoga"> Yoga </label>

            <input onBlur={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Astrology" id="astrology" />
            <label htmlFor="astrology"> Astrology </label>

            <input onBlur={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Apocalypse" id="apocalypse" />
            <label htmlFor="apocalypse"> Apocalypse </label>

            <input onBlur={this.handleChange} onClick={this.toggleRadio} type="radio" name="category" value="Shakespeare" id="shakespeare" />
            <label htmlFor="shakespeare"> Shakespeare </label>

          </fieldset>
          <input type="submit" value="Give me Words" id="" />
        </form>
      </section>
    )
  }
}

export default Form;