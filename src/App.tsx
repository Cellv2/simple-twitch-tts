import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import tmi from "tmi.js";

import Queue from "./classes/queue";

const queue = new Queue();

const App = () => {
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
        channels: ["loltyler1"],
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
        if (self) {
            return;
        }

        // had issues with undefined somehow getting sent?
        if (!message.length) {
            return;
        }

        console.log(`${tags["display-name"]}: ${message}`);

        // speak(message);

        utterance.text = message;
        synth.speak(utterance);

        // queue.enqueue(message);

        // speak(message);
    });

    // const initClient = () => {
    //     // we need to interact with the page to load the voices I believe
    //     // maybe can write a function to load them if they are not there?
    //     // otherwise just an initialisation for the tmi client should be enough (probs need that anyway)

    //     // https://tmijs.com/
    //     const client = new tmi.Client({
    //         connection: {
    //             secure: true,
    //             reconnect: true,
    //         },
    //         channels: [channelName],
    //     });

    //     client.connect();

    //     client.on("message", (channel, tags, message, self) => {
    //         if (self) {
    //             return;
    //         }

    //         console.log(`${tags["display-name"]}: ${message}`);

    //         queue.enqueue(message);

    //         // speak(message);
    //     });
    // };

    let isProcessing = false;
    const startQueue = () => {
        console.log("checking queue");
        if (!isProcessing) {
            isProcessing = true;
            do {
                speak(queue.dequeue());
            } while (queue.length());
        }

        isProcessing = false;
    };

    const [channelName, setChannelName] = useState<string>("");

    // const delay = 5000;
    // useEffect(() => {
    //     console.log("we started checking the queue again");
    //     let timer = setInterval(startQueue, delay);
    // }, []);

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
            <input
                type="text"
                name=""
                id="channelName"
                onChange={(val) => setChannelName(val.target.value)}
                value={channelName}
            />
            {/* <button onClick={initClient}>connect me KEKW</button> */}
        </div>
    );
};

export default App;
