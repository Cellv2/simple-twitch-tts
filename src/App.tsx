// https://docs.ourcodeworld.com/projects/artyom-js
// @ts-expect-error - frustratingly this doesn't work well with TS
import Artyom from "artyom.js";
import React, { useState } from "react";
import tmi from "tmi.js";
import "./App.css";

import BForm from "react-bootstrap/Form";

const artyom = new Artyom();

const App = () => {
    const [channelName, setChannelName] = useState<string>("");
    const [voice, setVoice] = useState<SpeechSynthesisVoice>(
        artyom
            .getVoices()
            .find((voice: SpeechSynthesisVoice) => voice.default === true)
    );

    const voiceOptions = (artyom.getVoices() as SpeechSynthesisVoice[]).map(
        (voice) => {
            console.log(`loading voice: ${voice.name}`);
            return voice;
        }
    );

    console.log(voiceOptions);

    // https://tmijs.com/
    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true,
        },
        channels: [channelName],
    });

    const connectClient = async () => {
        if (!channelName.length) {
            console.error("no channel set");
        }

        if (
            client.readyState() === "OPEN" ||
            client.readyState() === "CONNECTING"
        ) {
            await disconnectClient();
        }

        console.log("connecting client");
        await client
            .connect()
            .then(() => console.log(`connected to ${channelName}`));

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

    const disconnectClient = async () => {
        await client.disconnect();

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
                <BForm.Select aria-label="Default select example">
                    {/* <option>Open this select menu</option> */}
                    {/* <option value="1">One</option> */}
                    {/* <option value="2">Two</option> */}
                    {/* <option value="3">Three</option> */}
                    {voiceOptions.map((voice) => {
                        console.log(voice);
                        return <option key={voice.name}>{voice.name}</option>;
                    })}
                </BForm.Select>
                <p>
                    ENSURE THE BELOW HAS VALIDATION THAT THERE IS A CHANNEL NAME
                </p>
                <button onClick={async () => await connectClient()}>
                    connect me KEKW
                </button>
                <button onClick={async () => await disconnectClient()}>
                    get me the hell out of here
                </button>
            </header>
        </div>
    );
};

export default App;
