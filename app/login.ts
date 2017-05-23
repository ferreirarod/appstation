import Component from "./component";
import stateEngine from "./state-engine";
import * as firebase from "firebase";

export default class Login extends Component {

    private provider: firebase.auth.GoogleAuthProvider;

    constructor(parent: HTMLElement, id: string) {
        super(parent, id);

        this.provider = new firebase.auth.GoogleAuthProvider();

        this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

        this.provider.setCustomParameters({
            'login_hint': 'user@example.com'
        });
    }

    protected getInnerHTML(): string {
        return `<button id="${this.getId()}:googleLogin">Google Login</button>`;
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            if (property == "user") {
                console.log("ueba");
                this.getContainer().style.display = value != null ? 'none' : null;
            }
        }
    }

    protected afterRendered() {
        document.getElementById(`${this.getId()}:googleLogin`).onclick = () => {
            firebase.auth().signInWithRedirect(this.provider);
        }
    }

}