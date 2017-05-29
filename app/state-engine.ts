export class AppStationStateListeners {
    private listeners: Array<(state: Object, property: string, value: any) => void> = [];

    public addListener(fn: (state: Object, property: string, value: any) => void): void {
        if (fn != null) {
            this.listeners.push(fn);
        }
    }

    public removeListener(fn: (state: Object, property: string, value: any) => void): void {
        const listenerIndex = this.listeners.indexOf(fn);
        if (listenerIndex != -1) {
            this.listeners.splice(this.listeners.indexOf(fn), 1);
        }
    }

    public getListeners(): Array<(state: Object, property: string, value: any) => void> {
        return this.listeners;
    }

    public set(property: string, value: any) {
        (this as any)[property] = value;
    }

    public get(property: string): any {
        return (this as any)[property];
    }
}

const AppStationState: any = new Proxy(new AppStationStateListeners(), {
    set: (obj: any, property: string, value: any) => {
        obj[property] = value;
        obj.getListeners().forEach((fn: (state: Object, property: string, value: any) => void) => {
            fn(obj, property, value);
        })
        return true;
    }
});

const stateEngine: AppStationStateListeners = AppStationState as AppStationStateListeners;

export default stateEngine;