import stateEngine from "./state-engine";

abstract class Component {

    private parent: HTMLElement;

    private id: string;

    private container: HTMLElement;

    constructor(parent: HTMLElement, id: string) {
        this.parent = parent;
        this.id = id;
        this.container = document.createElement("div");
        this.container.id = this.id;
        this.container.innerHTML = this.getInnerHTML();
        this.parent.appendChild(this.container);
        this.afterRendered();

        stateEngine.addListener(this.onStateChange());
    }

    public setStyle(style: string): void {
        this.container.style.cssText = style;
    }

    public setClass(className: string): void {
        this.container.className = className;
    }

    public getId(): string {
        return this.id;
    }

    public getContainer(): HTMLElement {
        return this.container;
    }

    protected abstract getInnerHTML(): string;

    protected onStateChange(): (state: Object, property: string, value: any) => void{
        return () => {};
    }

    protected afterRendered(){
        // nothing here
    }

};

export default Component;