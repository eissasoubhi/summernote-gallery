export default class EventManager {
    private events_queue: {};
    constructor() {
        // events store
        this.events_queue = {};
    }

    // Register an event
    on(event_name: string, closure: any) {
        // @ts-ignore
        if (! Array.isArray(this.events_queue[event_name]) ) {
            // @ts-ignore
            this.events_queue[event_name] = [];
        }

        // @ts-ignore
        this.events_queue[event_name].push(closure);

        return this;
    }

    // Fire an event
    trigger(event_name: string, params: any = []) {
        // @ts-ignore
        const events = this.events_queue[event_name] || [];

        for (let i = 0; i < events.length; i++) {
            events[i].apply(this, params);
        }

        return this;
    }

    clearAll() {
        this.events_queue = {};

        return this;
    }
}