import React, { Component } from 'react';
import axios from 'axios';

class Form extends Component{
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
                    autoSuggest

                })
                

            })
            
        }
    }

    getElementOnClick = (e) => {
        this.setState({
            queryInput: e.target.innerHTML,
        })
    }

    getWords = (queryType, input) => {
        return axios.get(`https://api.datamuse.com/words?${queryType}=${input}`)
    }


    handleSubmit = (e) => {
        // TAKE THE VALUE OF THE INPUT ON SUMBIT, USE AS NEW API QUERY
        //array that the words will be pushed to 
        const tempArray = []
        e.preventDefault();
        const refineWords = (queryType, num) => {
            this.getWords(queryType, this.state.queryInput).then(({ data }) => {
                console.log(this.state.queryInput);
                // console.log(data);
                data.slice(0,num).map((word) => {
                    return tempArray.push(word.word);
                })
                // console.log(topTwenty);
            })
        }
        refineWords('ml', 20);
        refineWords('rel_jjb', 10);
        refineWords('rel_trg', 10);

        console.log(tempArray);

    }
    
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <input id="queryInput" onChange={this.handleChange} type="text" name="" value={this.state.queryInput}/>
                {this.state.queryInput ? 
                <ul>
                    {
                        this.state.autoSuggest.map((word, i) => {
                            return(
                                <li onClick={this.getElementOnClick} key={i}>{word}</li>
                            )
                        })
                    }
                </ul> : null}
                <fieldset className="category-options">
                    <input type="radio" name="category" value="Love" id="love"/>
                    <label htmlFor="love"> Love </label>
                    <input type="radio" name="category" value="Yoga" id="yoga"/>
                    <label htmlFor="yoga"> Yoga </label>
                    <input type="radio" name="category" value="Astrology" id="astrology"/>
                    <label htmlFor="astrology"> Astrology </label>
                    <input type="radio" name="category" value="Apocalypse" id="apocalypse"/>
                    <label htmlFor="apocalypse"> Apocalypse </label>
                    <input type="radio" name="category" value="Shakespeare" id="shakespeare" />
                    <label htmlFor="shakespeare"> Shakespeare </label>

                </fieldset>
                <input type="submit" value="Give me Words" id=""/>
            </form>
        )
    }
}

export default Form;