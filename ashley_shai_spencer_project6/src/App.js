import React, { Component } from 'react';
import './App.css';

// COMPONENTS
import Form from './components/Form'

class App extends Component {
    render() {
        return (
            <div className="App">
                <main className="wrapper">
                    <section className="fridge-container">
                        <h1>Sug Fun!</h1>
                        <Form />
                    </section>
                    <aside className="poem-dashboard">
                        <button className="reset">Reset</button>
                        <button className="share-poem">Share Poem</button>
                        <section className="word-container">
                            <ul className="word-list">
                                {/* map through the word choices array and create an li for each word  */}
                            </ul>
                        </section>

                    </aside>

                </main>
            </div>
        );
    }
}

export default App;
