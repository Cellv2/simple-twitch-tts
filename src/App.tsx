import React, { useEffect, useState } from "react";
import tmi from "tmi.js";
import "./App.css";

import BForm from "react-bootstrap/Form";
import Speech, { languageOptions, LanguageOptions } from "./classes/speech";

const speech = new Speech("Microsoft Hazel - English (United Kingdom)");
const artyom = speech.getSpeechInstance();

const App = () => {
    const [channelName, setChannelName] = useState<string>("");
    // const [voice, setVoice] = useState<SpeechSynthesisVoice>();
    const [voice, setVoice] = useState<LanguageOptions>(languageOptions[0]);

    // const [voice, setVoice] = useState<SpeechSynthesisVoice>(
    //     artyom
    //         .getVoices()
    //         .find((voice: SpeechSynthesisVoice) => voice.default === true)
    // );

    useEffect(() => {
        // const defaultVoice = artyom
        //     .getVoices()
        //     .find((voice: SpeechSynthesisVoice) => voice.default === true);

        // setVoice(defaultVoice);
        setVoice(languageOptions[0]);
    }, []);

    useEffect(() => {
        speech.setNewVoice(voice);
    }, [voice]);

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
            artyom.say(message);
        });
    };

    const disconnectClient = async () => {
        if (
            client.readyState() === "OPEN" ||
            client.readyState() === "CONNECTING"
        ) {
            console.log(`disconnecting from ${channelName}`);
            await client.disconnect();

            // stops speech just terminating half way through a sentence - not sure if this is a good idea ?
            // https://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/when
            artyom.when("SPEECH_SYNTHESIS_END", () => {
                artyom.shutUp();
                artyom.clearGarbageCollection();
            });

            console.log(`client disconnected`);
        }
    };

    // TODO: say voice updated (toast menu?)
    const voiceSelectionOnChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        event.preventDefault();
        event.persist();

        const value = event.target.value as LanguageOptions;
        setVoice(value);
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
                <BForm.Select
                    aria-label="Default select example"
                    onChange={(e) => voiceSelectionOnChange(e)}
                    value={voice}
                >
                    {languageOptions.map((voice) => {
                        // console.log(voice);
                        return <option key={voice}>{voice}</option>;
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
