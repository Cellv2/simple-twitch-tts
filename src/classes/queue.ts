class Queue {
    private data: any[] = [];
    private tail = 0;
    private maxQueueSize = 100;

    clear = (): void => {
        this.data = [];
        this.tail = 0;
    };

    dequeue = () => {
        if (this.isEmpty() === false) {
            this.tail = this.tail - 1;
            return this.data.shift();
        }
    };

    enqueue = (element: any): void => {
        if (this.tail < this.maxQueueSize) {
            this.data[this.tail] = element;
            this.tail++;
        }
    };

    getFront = () => {
        if (this.isEmpty() === false) {
            return this.data[0];
        }
    };

    getTail = () => {
        if (this.isEmpty() === false) {
            return this.data[this.tail - 1];
        }
    };

    isEmpty = (): boolean => {
        return this.tail === 0;
    };

    length = (): number => {
        return this.tail;
    };
}

const q = new Queue();

export default Queue;
