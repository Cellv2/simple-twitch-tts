// https://docs.ourcodeworld.com/projects/artyom-js
// @ts-expect-error - frustratingly this doesn't work well with TS
import Artyom from "artyom.js";
import {
    LanguageConfigurations,
    languageConfigurations
} from "../constants/language.constants";

export interface SpeechConstructor {
    new (
        languageToInit: LanguageConfigurations["displayName"],
        speed?: number,
        volume?: number,
        debug?: boolean
    ): SpeehInterface;
}

// TODO: rename this................
export interface SpeehInterface {
    getSpeechInstance: () => Artyom;
    setNewSpeed: (speed: number) => void;
    setNewVoice: (
        languageToInit: LanguageConfigurations["displayName"]
    ) => void;
    setNewVolume: (volume: number) => void;
}

const Speech: SpeechConstructor = class Speech implements SpeehInterface {
    // just used to keep track of the current languagewithout needing to do through the speechInstance
    displayName: LanguageConfigurations["displayName"];
    speechInstance: Artyom;
    constructor(
        languageToInit: LanguageConfigurations["displayName"],
        speed = 1,
        volume = 1,
        debug = false
    ) {
        this.displayName = languageToInit;
        this.speechInstance = new Artyom();
        console.log("SPEECH: ", this.speechInstance);
        this.setSpeechInstance(languageToInit, speed, volume, debug);
    }

    getSpeechInstance = () => {
        return this.speechInstance;
    };

    setSpeechInstance = (
        languageToInit: LanguageConfigurations["displayName"],
        speed = 1,
        volume = 1,
        debug = false
    ): void => {
        const { artyomVoiceIdentifier, languageCode } =
            languageConfigurations.find(
                (langConfig) => langConfig.displayName === languageToInit
            )!;
        const config = {
            debug,
            lang: languageCode,
            speed,
            volume,
        };

        this.displayName = languageToInit;
        this.speechInstance.initialize(config);
        this.speechInstance.ArtyomVoicesIdentifiers[`${languageCode}`] =
            artyomVoiceIdentifier;
    };

    setNewSpeed = (speed: number): void => {
        const { debug, lang, volume } =
            this.getSpeechInstance().getProperties();
        this.setSpeechInstance(lang, speed, volume, debug);
    };

    setNewVoice = (
        languageToInit: LanguageConfigurations["displayName"]
    ): void => {
        if (this.displayName !== languageToInit) {
            const { debug, speed, volume } =
                this.getSpeechInstance().getProperties();
            this.setSpeechInstance(languageToInit, speed, volume, debug);
        }
    };

    setNewVolume = (volume: number): void => {
        const { debug, lang, speed } = this.getSpeechInstance().getProperties();
        this.setSpeechInstance(lang, speed, volume, debug);
    };
};

const speechSingleton = new Speech("Microsoft Hazel - English (United Kingdom)")

export default speechSingleton;
