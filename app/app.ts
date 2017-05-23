import Component from "./component";
import Login from "./login";

export default class App extends Component {

    private login: Login;

    constructor(parent: HTMLElement, id: string) {
        super(parent, id);
        this.init();
    }

    protected getInnerHTML(): string {
        return `<h1>My Awesome App :)</h1>`;
    }

    private init(): void {
        this.login = new Login(this.getContainer(), "login");
    }

    protected onStateChange(state: Object, property: string, value: any): void {
        // nothing here (yet?)
    }

}