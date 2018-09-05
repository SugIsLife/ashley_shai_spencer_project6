import React, { Component } from 'react';
import axios from 'axios';

class AutoSuggest extends Component{
    constructor(){
        super();
        this.state = {
            // Contains the input value that will be used to make api call for suggestions
            queryInput: '',
            // Prototyping our array of returned suggestions
            autoSuggest: [],
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
        if (e.target.id === "queryInput"){
            this.suggestionQuery(e.target.value)
            .then(({ data }) => {
                // map over the suggestions, returning an array of just the words
                const autoSuggest = data.map((word) => {
                    return word.word
                })
                // change state of our auto suggestions and make sure the every time a query is made, we reset our clicked suggestion
                this.setState({
                    autoSuggest,
                    // reset clicked suggestion to blank
                    clickedSuggestion: '',
                })

            })
        }
    }

    getElementOnClick = (e) => {
        this.setState({
            clickedSuggestion: e.target.innerHTML,
        })
    }

    handleSumbit = (e) => {
        // TAKE THE VALUE OF THE INPUT ON SUMBIT, USE AS NEW API QUERY
    }
    
    render(){
        return(
            <form onSubmit={this.handleSumbit}>
                <input id="queryInput" onChange={this.handleChange} type="text" name="" value={this.state.clickedSuggestion ? this.state.clickedSuggestion : null}/>
                <ul>
                    {
                        this.state.autoSuggest.map((word, i) => {
                            return(
                                <li onClick={this.getElementOnClick} key={i}>{word}</li>
                            )
                        })
                    }
                </ul>
            </form>
        )
    }
}

export default AutoSuggest;