export interface GridStackOptions {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    autoPosition?: boolean,
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
    private contentElement: HTMLElement;
    private x: number;
    private y: number;
    private autoPosition: boolean;

    constructor(id: string, name: string, description: string, fullscreen?: boolean, width?: number, height?: number) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.fullscreen = fullscreen;
        this.name = name;
        this.description = description;

        this.autoPosition = true;

        this.container = document.createElement("div");
        this.container.id = this.id;

        this.contentElement = document.createElement("div");
        this.contentElement.className = "grid-stack-item-content ui-draggable-handle";
        this.contentElement.innerHTML = this.getInnerHTML();
        this.container.appendChild(this.contentElement);
    }

    protected getInnerHTML(): string {
        return '';
    }

    public onWidgetCreated() {
        // nothing here
    }

    public onWidgetRemoved() {
        // nothing here
    }

    public getContainer(): HTMLElement {
        return this.container;
    }

    public getContentElement(): HTMLElement {
        return this.contentElement;
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
            x: this.x || 0,
            y: this.y || 0,
            width: this.width,
            height: this.height,
            autoPosition: this.autoPosition,
            id: this.id
        }
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }

    public setWidth(width: number): void {
        this.width = width;
    }

    public setHeight(height: number): void {
        this.height = height;
    }

    public setAutoPosition(autoPosition: boolean): void {
        this.autoPosition = autoPosition;
    }
}

export default App;