export interface GridStackOptions {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    autoPosition?: true,
    minWidth?: number,
    maxWidth?: number,
    minHeight?: number,
    maxHeight?: number,
    id: string
}

abstract class App {

    private id: string;
    private width: number;
    private height: number;
    private container: HTMLElement;
    private fullscreen: boolean;
    private name: string;
    private description: string;

    constructor(id: string, name: string, description: string, fullscreen?: boolean, width?: number, height?: number) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.fullscreen = fullscreen;
        this.name = name;
        this.description = description;

        this.container = document.createElement("div");
        this.container.id = this.id;
        this.container.innerHTML = this.getInnerHTML();
    }

    protected getInnerHTML(): string {
        return '';
    }

    protected onWidgetCreated() {
        // nothing here
    }

    public getContainer(): HTMLElement {
        return this.container;
    }

    public getId(): string {
        return this.id;
    }

    public isFullScreenApp(): boolean {
        return this.fullscreen;
    }

    protected onWidget(): void {

    }

    protected onFullScreen(): void {

    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getGridStackOptions(): GridStackOptions {
        return {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            autoPosition: true,
            id: this.id
        }
    }
}

export default App;