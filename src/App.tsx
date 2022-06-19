import { useEffect, useState } from "react";
import "./App.css";

import BButton from "react-bootstrap/Button";
import BCol from "react-bootstrap/Col";
import BContainer from "react-bootstrap/Container";
import BForm from "react-bootstrap/Form";
import BRow from "react-bootstrap/Row";
import BToastContainer from "react-bootstrap/ToastContainer";
import speechSingleton from "./services/speech";
import twitchClientSingleton from "./services/twitch";
import Toast, { ToastComponentProps } from "./components/Toast";
import {
    languageOptions,
    LanguageOptions,
} from "./constants/language.constants";

type ToastListItem = {
    id: number;
} & ToastComponentProps;

const App = () => {
    const [channelName, setChannelName] = useState<string>("");
    const [toastList, setToastList] = useState<ToastListItem[]>([]);
    const [voice, setVoice] = useState<LanguageOptions>(languageOptions[0]);
    const [volume, setVolume] = useState<string>("50");

    useEffect(() => {
        speechSingleton.setNewVoice(voice);
    }, [voice]);

    useEffect(() => {
        speechSingleton.setNewVolume(+volume);
    }, [volume]);

    // TODO: the way this function is passed around is err.. yeah
    // TOdO: maybe pull this out into context? Really don't want to go for redux for something this small
    // TODO: probably also want to handly removing elements fromthe list
    const addToastListItem = (toastProps: ToastComponentProps) => {
        // need to do this with prevState as the functions using this are async, and it's overwriting itself
        // https://reactjs.org/docs/hooks-reference.html#functional-updates
        setToastList((prevState) => {
            const id = prevState.at(-1) ? prevState.at(-1)!.id + 1 : 0;

            return [...prevState, { ...toastProps, id }];
        });
    };

    useEffect(() => {
        // console.log(toastList);
    }, [toastList]);

    // useEffect(() => {
    //     const interval = setInterval(() => {

    //     }, REMOVE_DELAY);
    //     return () => {
    //         clearInterval(interval);
    //     }
    // }, []);

    // const deleteListItem = () => {
    //     const interval = setInterval(() => {}, REMOVE_DELAY);
    // };

    useEffect(() => {
        const interval = setInterval(() => {
            while (!twitchClientSingleton.messageQueue().isEmpty()) {
                speechSingleton
                    .getSpeechInstance()
                    .say(twitchClientSingleton.messageQueue().dequeue());
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    // TODO: say voice updated (toast menu?)

    return (
        <>
            <div className="App">
                <div className="App-header">
                    <BContainer>
                        <BForm>
                            <BForm.Group
                                as={BRow}
                                className="mb-3 d-flex align-items-center"
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
                                className="mb-3 d-flex align-items-center"
                                controlId="formVoiceSelect"
                            >
                                <BForm.Label column sm={2} className="">
                                    Voice
                                </BForm.Label>
                                <BCol sm={10}>
                                    <BForm.Select
                                        aria-label="Select voice language"
                                        onChange={(e) =>
                                            setVoice(
                                                e.target
                                                    .value as LanguageOptions
                                            )
                                        }
                                        value={voice}
                                    >
                                        {languageOptions.map((voice) => {
                                            // console.log(voice);
                                            return (
                                                <option key={voice}>
                                                    {voice}
                                                </option>
                                            );
                                        })}
                                    </BForm.Select>
                                </BCol>
                            </BForm.Group>
                            <BForm.Group
                                as={BRow}
                                className="mb-3 d-flex align-items-center"
                                controlId="formVolumeControl"
                            >
                                <BForm.Label column sm={2}>
                                    Volume: {+volume * 2}
                                </BForm.Label>
                                <BCol sm={10}>
                                    <BForm.Range
                                        className="bsRangeHeightOverride"
                                        onChange={(e) =>
                                            setVolume(e.target.value)
                                        }
                                    />
                                </BCol>
                            </BForm.Group>
                            <BForm.Group as={BRow} className="mb-3">
                                <BCol sm={{ span: 10, offset: 2 }}>
                                    <BButton
                                        type="submit"
                                        variant="primary"
                                        onClick={async (evt) => {
                                            evt.preventDefault();
                                            await twitchClientSingleton.connectClient(
                                                channelName,
                                                addToastListItem
                                            );
                                        }}
                                    >
                                        Connect
                                    </BButton>{" "}
                                    <BButton
                                        type="button"
                                        variant="outline-danger"
                                        onClick={async () =>
                                            await twitchClientSingleton.disconnectClient(
                                                addToastListItem
                                            )
                                        }
                                    >
                                        Disconnect
                                    </BButton>
                                </BCol>
                            </BForm.Group>
                        </BForm>
                        <BCol sm={{ span: 10, offset: 2 }}>
                            <span className="small">
                                Voice and volume will auto update on the next
                                message :)
                            </span>
                        </BCol>
                    </BContainer>
                    <BToastContainer position="bottom-end" className="p-3">
                        {toastList.map((item) => {
                            return (
                                <Toast
                                    key={item.id}
                                    heading={item.heading}
                                    message={item.message}
                                    variant={item.variant}
                                />
                            );
                        })}
                    </BToastContainer>
                </div>
            </div>
        </>
    );
};

export default App;
