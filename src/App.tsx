// https://docs.ourcodeworld.com/projects/artyom-js
// @ts-expect-error - frustratingly this doesn't work well with TS
import Artyom from "artyom.js";
import React, { useState } from "react";
import tmi from "tmi.js";
import "./App.css";

const artyom = new Artyom();

const App = () => {
    const [channelName, setChannelName] = useState<string>("");

    // https://tmijs.com/
    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true,
        },
        channels: [channelName],
    });

    const connectClient = () => {
        if (!channelName.length) {
            console.error("no channel set");
        }

        console.log("connecting client");
        client.connect().then(() => console.log(`connected to ${channelName}`));

        client.on("message", (channel, tags, message, self) => {
            if (self) {
                return;
            }

            // had issues with undefined somehow getting sent?
            if (!message.length) {
                return;
            }

            // console.log(`${tags["display-name"]}: ${message}`);
            artyom.say(message);
        });
    };

    const disconnectClient = () => {
        client.disconnect();

        // stops speech just terminating half way through a sentence - not sure if this is a good idea ?
        // https://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/when
        artyom.when("SPEECH_SYNTHESIS_END", () => {
            artyom.shutUp();
            artyom.clearGarbageCollection();
        });

        console.log(`disconnected from ${channelName}`);
    };

    return (
        <div className="App">
            <header className="App-header">
                <input
                    type="text"
                    name=""
                    id="channelName"
                    onChange={(val) => setChannelName(val.target.value)}
                    value={channelName}
                />
                <p>
                    ENSURE THE BELOW HAS VALIDATION THAT THERE IS A CHANNEL NAME
                </p>
                <button onClick={connectClient}>connect me KEKW</button>
                <button onClick={disconnectClient}>
                    get me the hell out of here
                </button>
            </header>
        </div>
    );
};

export default App;
