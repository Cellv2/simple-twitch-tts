import React, { useEffect, useState } from "react";
import "./App.css";

import BForm from "react-bootstrap/Form";
import speechSingleton from "./classes/speech";
import twitchClientSingleton from "./classes/twitch";
import {
    languageOptions,
    LanguageOptions,
} from "./constants/language.constants";

const App = () => {
    const [channelName, setChannelName] = useState<string>("");
    const [voice, setVoice] = useState<LanguageOptions>(languageOptions[0]);
    const [volume, setVolume] = useState<string>("50");

    useEffect(() => {
        speechSingleton.setNewVoice(voice);
    }, [voice]);

    useEffect(() => {
        speechSingleton.setNewVolume(+volume);
    }, [volume]);

    // TODO: say voice updated (toast menu?)
    const voiceSelectionOnChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        event.preventDefault();

        const value = event.target.value as LanguageOptions;
        setVoice(value);
    };

    const volumeRangeOnChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault();

        const value = event.target.value;
        setVolume(value);
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
                    onChange={voiceSelectionOnChange}
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
                <button
                    onClick={async () =>
                        await twitchClientSingleton.connectClient(channelName)
                    }
                >
                    connect me KEKW
                </button>
                <button
                    onClick={async () =>
                        await twitchClientSingleton.disconnectClient()
                    }
                >
                    get me the hell out of here
                </button>
                <>
                    <BForm.Label>Volume: {+volume * 2}</BForm.Label>
                    <BForm.Range onChange={volumeRangeOnChange} />
                </>
            </header>
        </div>
    );
};

export default App;
