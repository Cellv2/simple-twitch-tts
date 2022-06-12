interface QueueConstructor {
    new (
        maxQueueSize: number,
        allowQueueDrop: boolean,
        // ugly but whatever :)
        queueDropPct: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
    ): QueueInterface;
}

interface QueueInterface {
    clear: () => void;
    dequeue: () => any | null;
    enqueue: (item: any) => void;
    front: () => any | null;
    isEmpty: () => boolean;
    last: () => any;
    length: () => number;
}

const Queue: QueueConstructor = class Queue implements QueueInterface {
    data: any[] = [];
    maxSize: number;
    tail: number = 0;
    queueDropEnabled: boolean;
    queueDropPct: number;

    /**
     * @constructor
     * @param {number} maxQueueSize Size before the queue is full and messages start to be dropped
     * @param {boolean} allowQueueDrop If the queue his maxQueueSize, if true items will be dropped from the front of the queue
     * @param {number} queueDropPct The percentage of items to drop from the front if allowQueueDrop is true
     */
    constructor(
        maxQueueSize: number = 100,
        allowQueueDrop: boolean = true,
        queueDropPct: number = 50
    ) {
        this.maxSize = maxQueueSize;
        this.queueDropEnabled = allowQueueDrop;
        this.queueDropPct = queueDropPct;
    }

    clear = () => {
        this.data = [];
        this.tail = 0;
    };

    dequeue = () => {
        if (!this.isEmpty()) {
            this.tail = this.tail - 1;
            return this.data.shift();
        } else {
            return null;
        }
    };

    enqueue = (item: any) => {
        // TODO: add queue drop
        if (this.tail < this.maxSize) {
            this.data[this.tail] = item;
            this.tail = this.tail + 1;
        }
    };

    front = () => {
        if (!this.isEmpty() === false) {
            return this.data[0];
        } else {
            return null;
        }
    };

    isEmpty = (): boolean => this.tail === 0;

    last = () => {
        if (!this.isEmpty()) {
            return this.data[this.tail - 1];
        }
    };

    length = (): number => this.tail;
};

export default Queue;
