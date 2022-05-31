import React, { useEffect, useState } from "react";
import "./App.css";

import BButton from "react-bootstrap/Button";
import BCol from "react-bootstrap/Col";
import BContainer from "react-bootstrap/Container";
import BForm from "react-bootstrap/Form";
import BRow from "react-bootstrap/Row";
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

    return (
        <div className="App">
            <div className="App-header">
                <BContainer>
                    <BForm>
                        <BForm.Group
                            as={BRow}
                            className="mb-3"
                            controlId="formChannelName"
                        >
                            <BForm.Label column sm={2}>
                                Channel
                            </BForm.Label>
                            <BCol sm={10}>
                                <BForm.Control
                                    type="text"
                                    placeholder="Channel"
                                    onChange={(val) =>
                                        setChannelName(val.target.value)
                                    }
                                    value={channelName}
                                />
                            </BCol>
                        </BForm.Group>

                        <BForm.Group
                            as={BRow}
                            className="mb-3"
                            controlId="formVoiceSelect"
                        >
                            <BForm.Label column sm={2}>
                                Voice
                            </BForm.Label>
                            <BCol sm={10}>
                                <BForm.Select
                                    aria-label="Select voice language"
                                    onChange={(e) =>
                                        setVoice(
                                            e.target.value as LanguageOptions
                                        )
                                    }
                                    value={voice}
                                >
                                    {languageOptions.map((voice) => {
                                        // console.log(voice);
                                        return (
                                            <option key={voice}>{voice}</option>
                                        );
                                    })}
                                </BForm.Select>
                            </BCol>
                        </BForm.Group>
                        <BForm.Group
                            as={BRow}
                            className="mb-3"
                            controlId="formVolumeControl"
                        >
                            <BForm.Label column sm={2}>
                                Volume: {+volume * 2}
                            </BForm.Label>
                            <BCol sm={10}>
                                <BForm.Range
                                    onChange={(e) => setVolume(e.target.value)}
                                />
                            </BCol>
                        </BForm.Group>
                        <BForm.Group as={BRow} className="mb-3">
                            <BCol sm={{ span: 10, offset: 2 }}>
                                <BButton
                                    variant="primary"
                                    onClick={async () =>
                                        await twitchClientSingleton.connectClient(
                                            channelName
                                        )
                                    }
                                >
                                    Connect
                                </BButton>{" "}
                                <BButton
                                    type="button"
                                    variant="outline-danger"
                                    onClick={async () =>
                                        await twitchClientSingleton.disconnectClient()
                                    }
                                >
                                    Disconnect
                                </BButton>
                            </BCol>
                        </BForm.Group>
                    </BForm>
                </BContainer>
            </div>
        </div>
    );
};

export default App;
