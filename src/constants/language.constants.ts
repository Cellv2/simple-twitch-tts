export const languageOptions = [
    "Microsoft Hazel - English (United Kingdom)",
    "Microsoft Susan - English (United Kingdom)",
    "Microsoft George - English (United Kingdom)",
    "Google UK English Female",
    "Google UK English Male",
] as const;
export type LanguageOptions = typeof languageOptions[number];

export type LanguageConfigurations = {
    artyomVoiceIdentifier: string[];
    displayName: LanguageOptions;
    languageCode: string;
};
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
