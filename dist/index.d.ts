declare abstract class Component {
    private parent;
    private id;
    private container;
    constructor(parent: HTMLElement, id: string);
    setStyle(style: string): void;
    setClass(className: string): void;
    getId(): string;
    getContainer(): HTMLElement;
    protected getInnerHTML(): string;
    protected onStateChange(): (state: Object, property: string, value: any) => void;
    protected afterRendered(): void;
}
export interface LoginProviders {
    email?: boolean;
    phone?: boolean;
    google?: boolean;
    facebook?: boolean;
    twitter?: boolean;
    github?: boolean;
}
declare class Login extends Component {
    private titleElement;
    protected getInnerHTML(): string;
    private createLoginButton(provider);
    private buildLoginButtons(value);
    protected onStateChange(): (state: Object, property: string, value: any) => void;
    protected afterRendered(): void;
}
export interface GridStackOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    autoPosition?: boolean;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    id: string;
}
export declare abstract class App {
    private id;
    private width;
    private height;
    private container;
    private fullscreen;
    private name;
    private description;
    private contentElement;
    private x;
    private y;
    private autoPosition;
    constructor(id: string, name: string, description: string, fullscreen?: boolean, width?: number, height?: number);
    setBadge(badge: string): void;
    protected getInnerHTML(): string;
    onWidgetCreated(): void;
    onWidgetRemoved(): void;
    getContainer(): HTMLElement;
    getContentElement(): HTMLElement;
    getId(): string;
    isFullScreenApp(): boolean;
    onWidget(): void;
    onFullScreen(): void;
    getName(): string;
    getDescription(): string;
    getGridStackOptions(): GridStackOptions;
    setX(x: number): void;
    setY(y: number): void;
    setWidth(width: number): void;
    setHeight(height: number): void;
    setAutoPosition(autoPosition: boolean): void;
}
export default class AppStation extends Component {
    private login;
    private content;
    private loading;
    private firstHashLoad;
    constructor(config: any, apps: Array<App>, loginProviders: LoginProviders, appName?: string);
    protected afterRendered(): void;
    protected onStateChange(): (state: Object, property: string, value: any) => void;
}