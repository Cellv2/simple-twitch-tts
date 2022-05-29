// https://docs.ourcodeworld.com/projects/artyom-js
// @ts-expect-error - frustratingly this doesn't work well with TS
import Artyom from "artyom.js";
import React, { useEffect, useState } from "react";
import tmi from "tmi.js";
import "./App.css";

import BForm from "react-bootstrap/Form";

const artyom = new Artyom();
// artyom.initialize({lang: "en-GB", voiceURI: "Microsoft Hazel - English (United Kingdom)"});


// TODO: sort out langauges:
// https://github.com/sdkcarlos/artyom.js/issues/39#issuecomment-324627434
// Just change the order of voice, artyom takes the first voice available for a language, so the order to select the female first when available would be:

// const myAssistant = new Artyom();

// Change voice order:
// original object property prefers male voice:
// "en-GB": ["Google UK English Male", "Google UK English Female", "en-GB", "en_GB"],

// Prefer Female voice
// myAssistant.ArtyomVoicesIdentifiers["en-GB"] = ["Google UK English Female", "Google UK English Male", "en-GB", "en_GB"];

// // Rest of your code
artyom.ArtyomVoicesIdentifiers["en-GB"] = ["Google UK English Female", "Google UK English Male", "en-GB", "en_GB"];


artyom.initialize({
    lang: "en-GB",
    debug: true, // Show what recognizes in the Console
    speed: 0.9, // Talk a little bit slow
    mode: "normal", // This parameter is not required as it will be normal by default
});

const App = () => {
    const [channelName, setChannelName] = useState<string>("");
    // const [voice, setVoice] = useState<SpeechSynthesisVoice>();

    const [voice, setVoice] = useState<SpeechSynthesisVoice>(
        artyom
            .getVoices()
            .find((voice: SpeechSynthesisVoice) => voice.default === true)
    );

    useEffect(() => {
        const defaultVoice = artyom
            .getVoices()
            .find((voice: SpeechSynthesisVoice) => voice.default === true);

        setVoice(defaultVoice);
    }, []);

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

            // maybe mute anything which starts with http(s)://

            // console.log(`${tags["display-name"]}: ${message}`);
            artyom.say(message, { lang: voice.lang });
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
                        // console.log(voice);
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
