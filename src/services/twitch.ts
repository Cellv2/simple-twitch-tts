import tmi from "tmi.js";
import { ToastComponentProps } from "../components/Toast";
import Queue, { QueueInterface } from "../helpers/queue.helper";
import speechSingleton from "./speech";

interface TwitchClientConstructor {
    new (): TwitchClientInterface;
}

interface TwitchClientInterface {
    connectClient: (
        channel: string,
        addToastListItem: (toastProps: ToastComponentProps) => void
    ) => Promise<void>;
    disconnectClient: (
        addToastListItem: (toastProps: ToastComponentProps) => void
    ) => Promise<void>;
    messageQueue: () => QueueInterface
}

const TwitchClient: TwitchClientConstructor = class TwitchClient
    implements TwitchClientInterface
{
    channelName: string = "";
    client: tmi.Client;
    speechSynth = speechSingleton.getSpeechInstance();
    queue = new Queue();
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

    connectClient = async (
        channel: string,
        addToastListItem: (toastProps: ToastComponentProps) => void
    ) => {
        if (
            this.client.readyState() === "OPEN" ||
            this.client.readyState() === "CONNECTING"
        ) {
            await this.disconnectClient(addToastListItem);
        }

        this.channelName = channel;

        if (!this.channelName.length) {
            console.error("no channel set");
            addToastListItem({
                variant: "Warning",
                heading: "No Channel Set",
                message: "Please set a channel to connect",
            });

            return;
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
        addToastListItem({
            variant: "Primary",
            heading: `Connecting`,
            message: `Connecting to ${this.channelName}`,
        });

        await this.client.connect().then(() => {
            console.log(`connected to ${this.channelName}`);
        });

        addToastListItem({
            variant: "Success",
            heading: `Connected`,
            message: `Successfully connected to ${this.channelName}`,
        });

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
            // this.speechSynth.say(message);
            this.queue.enqueue(message);
        });
    };

    disconnectClient = async (
        addToastListItem: (toastProps: ToastComponentProps) => void
    ) => {
        if (
            this.client.readyState() === "OPEN" ||
            this.client.readyState() === "CONNECTING"
        ) {
            console.log(`disconnecting from ${this.channelName}`);
            addToastListItem({
                variant: "Danger",
                heading: `Disconnecting`,
                message: `Disconnecting from ${this.channelName}`,
            });
            await this.client.disconnect();

            // stops speech just terminating half way through a sentence - not sure if this is a good idea ?
            // https://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/when
            this.speechSynth.when("SPEECH_SYNTHESIS_END", () => {
                this.speechSynth.shutUp();
                this.speechSynth.clearGarbageCollection();
            });

            addToastListItem({
                variant: "Success",
                heading: `Disconnected`,
                message: `Successfully disconnected from ${this.channelName}`,
            });
            console.log(`client disconnected`);
        } else {
            addToastListItem({
                variant: "Info",
                heading: `Not Connected`,
                message: "Not currently connected to any channel!",
            });
        }
    };

    messageQueue = () => this.queue;
};

const twitchClientSingleton = new TwitchClient();

export default twitchClientSingleton;
