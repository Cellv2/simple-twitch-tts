import React from "react";
import logo from "./logo.svg";
import "./App.css";

import tmi from "tmi.js";

const  App = () => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    const utterance = new SpeechSynthesisUtterance();
    utterance.voice = voices[5];
    utterance.volume = 0.5;
    utterance.rate = 1;
    utterance.pitch = 1;
    // utterance.text = message;
    utterance.lang = "";

    const speak = (message: string) => {
        utterance.text = message;
        synth.speak(utterance);
    };

    // https://tmijs.com/
    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true,
        },
        channels: [""],
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
        if (self) {
            return;
        }

        console.log(`${tags["display-name"]}: ${message}`);

        speak(message);
    });

    const initClient = () => {
        // we need to interact with the page to load the voices I believe
        // maybe can write a function to load them if they are not there?
        // otherwise just an initialisation for the tmi client should be enough (probs need that anyway)
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            {/* <button onClick={initClient}>connect me KEKW</button> */}
        </div>
    );
}

export default App;
