// https://docs.ourcodeworld.com/projects/artyom-js
// @ts-expect-error - frustratingly this doesn't work well with TS
import Artyom from "artyom.js";

interface SpeechConstructor {
    new (
        languageToInit: LanguageConfigurations["displayName"],
        speed?: number,
        volume?: number,
        debug?: boolean
    ): SpeehInterface;
}

interface SpeehInterface {
    getSpeechInstance: () => Artyom;
    setNewSpeed: (speed: number) => void;
    setNewVoice: (
        languageToInit: LanguageConfigurations["displayName"]
    ) => void;
    setNewVolume: (volume: number) => void;
}

type LanguageConfigurations = {
    artyomVoiceIdentifier: string[];
    displayName: LanguageOptions;
    languageCode: string;
};

export const languageOptions = [
    "Microsoft Hazel - English (United Kingdom)",
    "Microsoft Susan - English (United Kingdom)",
    "Microsoft George - English (United Kingdom)",
    "Google UK English Female",
    "Google UK English Male",
] as const;
export type LanguageOptions = typeof languageOptions[number];

// https://github.com/sdkcarlos/artyom.js/issues/39#issuecomment-324627434
// this is.... less than ideal, but I cannot seem to find another way of doing this using the artyom.js lib
// the lib seems to read the voiceId array and takes the first available one, so we need to modify the array on initialisation to get male / female voices
export const languageConfigurations: LanguageConfigurations[] = [
    {
        languageCode: "en-GB",
        displayName: "Microsoft Hazel - English (United Kingdom)",
        artyomVoiceIdentifier: [
            "Microsoft Hazel - English (United Kingdom)",
            "Google UK English Female",
            "Google UK English Male",
            "en-GB",
            "en_GB",
        ],
    },
    {
        languageCode: "en-GB",
        displayName: "Microsoft Susan - English (United Kingdom)",
        artyomVoiceIdentifier: [
            "Microsoft Susan - English (United Kingdom)",
            "Google UK English Female",
            "Google UK English Male",
            "en-GB",
            "en_GB",
        ],
    },
    {
        languageCode: "en-GB",
        displayName: "Microsoft George - English (United Kingdom)",
        artyomVoiceIdentifier: [
            "Microsoft George - English (United Kingdom)",
            "Google UK English Male",
            "Google UK English Female",
            "en-GB",
            "en_GB",
        ],
    },
    {
        languageCode: "en-GB",
        displayName: "Google UK English Female",
        artyomVoiceIdentifier: [
            "Google UK English Female",
            "Google UK English Male",
            "en-GB",
            "en_GB",
        ],
    },
    {
        languageCode: "en-GB",
        displayName: "Google UK English Male",
        artyomVoiceIdentifier: [
            "Google UK English Male",
            "Google UK English Female",
            "en-GB",
            "en_GB",
        ],
    },
];

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

export default Speech;
