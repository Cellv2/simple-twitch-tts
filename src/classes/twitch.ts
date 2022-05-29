import tmi from "tmi.js";
import speechSingleton, { SpeehInterface } from "./speech";

interface TwitchClientConstructor {
    new (): TwitchClientInterface;
}

interface TwitchClientInterface {
    connectClient: (channel: string) => Promise<void>;
    disconnectClient: () => Promise<void>;
}

const TwitchClient: TwitchClientConstructor = class TwitchClient
    implements TwitchClientInterface
{
    channelName: string = "";
    client: tmi.Client;
    speechSynth = speechSingleton.getSpeechInstance();
    constructor() {
        // https://tmijs.com/
        this.client = new tmi.Client({
            connection: {
                secure: true,
                reconnect: true,
            },
            channels: [this.channelName],
        });
    }

    connectClient = async (channel: string) => {
        this.channelName = channel;

        if (!this.channelName.length) {
            console.error("no channel set");
        }

        if (
            this.client.readyState() === "OPEN" ||
            this.client.readyState() === "CONNECTING"
        ) {
            await this.disconnectClient();
        }

        // https://tmijs.com/
        this.client = new tmi.Client({
            connection: {
                secure: true,
                reconnect: true,
            },
            channels: [channel],
        });

        console.log("connecting client");
        await this.client
            .connect()
            .then(() => console.log(`connected to ${this.channelName}`));

        this.client.on("message", (channel, tags, message, self) => {
            if (self) {
                return;
            }

            // had issues with undefined somehow getting sent?
            if (!message.length) {
                return;
            }

            // maybe mute anything which starts with http(s)://

            // console.log(`${tags["display-name"]}: ${message}`);
            this.speechSynth.say(message);
        });
    };

    disconnectClient = async () => {
        if (
            this.client.readyState() === "OPEN" ||
            this.client.readyState() === "CONNECTING"
        ) {
            console.log(`disconnecting from ${this.channelName}`);
            await this.client.disconnect();

            // stops speech just terminating half way through a sentence - not sure if this is a good idea ?
            // https://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/when
            this.speechSynth.when("SPEECH_SYNTHESIS_END", () => {
                this.speechSynth.shutUp();
                this.speechSynth.clearGarbageCollection();
            });

            console.log(`client disconnected`);
        }
    };
};

const twitchClientSingleton = new TwitchClient();

export default twitchClientSingleton;
