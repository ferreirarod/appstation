import Component from "./component";
import stateEngine from "./state-engine";
import * as firebase from "firebase";

export interface LoginProviders {
    email?: boolean,
    phone?: boolean,
    google?: boolean,
    facebook?: boolean,
    twitter?: boolean,
    github?: boolean
}

export class Login extends Component {

    private titleElement: HTMLElement;

    protected getInnerHTML(): string {
        return `
            <span id="${this.getId()}-title" class="app-station-login-title">App Station</span>
        `;
    }

    private createLoginButton(provider: firebase.auth.AuthProvider): HTMLDivElement {
        const button = document.createElement("div");
        button.className = 'app-station-login-button';
        let buttonText = null;
        if (provider instanceof firebase.auth.EmailAuthProvider) {
            buttonText = 'Sign in with email';
        } else if (provider instanceof firebase.auth.GoogleAuthProvider) {
            buttonText = `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="118px" height="120px" viewBox="0 0 118 120" version="1.1">
                    <!-- Generator: Sketch 3.6 (26304) - http://www.bohemiancoding.com/sketch -->
                    <title>google_buttn</title>
                    <desc>Created with Sketch.</desc>
                    <defs/>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Artboard-1" transform="translate(-332.000000, -639.000000)">
                            <g id="google_buttn" transform="translate(332.000000, 639.000000)">
                                <g id="logo_googleg_48dp">
                                    <path d="M117.6,61.3636364 C117.6,57.1090909 117.218182,53.0181818 116.509091,49.0909091 L60,49.0909091 L60,72.3 L92.2909091,72.3 C90.9,79.8 86.6727273,86.1545455 80.3181818,90.4090909 L80.3181818,105.463636 L99.7090909,105.463636 C111.054545,95.0181818 117.6,79.6363636 117.6,61.3636364 L117.6,61.3636364 Z" id="Shape" fill="#4285F4"/>
                                    <path d="M60,120 C76.2,120 89.7818182,114.627273 99.7090909,105.463636 L80.3181818,90.4090909 C74.9454545,94.0090909 68.0727273,96.1363636 60,96.1363636 C44.3727273,96.1363636 31.1454545,85.5818182 26.4272727,71.4 L6.38181818,71.4 L6.38181818,86.9454545 C16.2545455,106.554545 36.5454545,120 60,120 L60,120 Z" id="Shape" fill="#34A853"/>
                                    <path d="M26.4272727,71.4 C25.2272727,67.8 24.5454545,63.9545455 24.5454545,60 C24.5454545,56.0454545 25.2272727,52.2 26.4272727,48.6 L26.4272727,33.0545455 L6.38181818,33.0545455 C2.31818182,41.1545455 0,50.3181818 0,60 C0,69.6818182 2.31818182,78.8454545 6.38181818,86.9454545 L26.4272727,71.4 L26.4272727,71.4 Z" id="Shape" fill="#FBBC05"/>
                                    <path d="M60,23.8636364 C68.8090909,23.8636364 76.7181818,26.8909091 82.9363636,32.8363636 L100.145455,15.6272727 C89.7545455,5.94545455 76.1727273,0 60,0 C36.5454545,0 16.2545455,13.4454545 6.38181818,33.0545455 L26.4272727,48.6 C31.1454545,34.4181818 44.3727273,23.8636364 60,23.8636364 L60,23.8636364 Z" id="Shape" fill="#EA4335"/>
                                    <path d="M0,0 L120,0 L120,120 L0,120 L0,0 Z" id="Shape"/>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
                <span>Sign in with Google</span>
            `;
        } else if (provider instanceof firebase.auth.FacebookAuthProvider) {
            buttonText = 'Sign in with Facebook';
        } else if (provider instanceof firebase.auth.TwitterAuthProvider) {
            buttonText = 'Sign in with Twitter';
        } else if (provider instanceof firebase.auth.GithubAuthProvider) {
            buttonText = 'Sign in with Github';
        } else if (provider instanceof firebase.auth.PhoneAuthProvider) {
            buttonText = 'Sign in with phone';
        }
        button.innerHTML = buttonText;
        button.onclick = () => {
            firebase.auth().signInWithRedirect(provider);
        }
        return button;
    }

    private buildLoginButtons(value: LoginProviders) {
        const { email, phone, google, facebook, twitter, github } = value as LoginProviders;
        if (email == true) {
            const provider = new firebase.auth.EmailAuthProvider;
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (phone == true) {
            const provider = new firebase.auth.PhoneAuthProvider();
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (google == true) {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (facebook == true) {
            const provider = new firebase.auth.FacebookAuthProvider();
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (twitter == true) {
            const provider = new firebase.auth.TwitterAuthProvider();
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (github == true) {
            const provider = new firebase.auth.GithubAuthProvider();
            provider.addScope('repo');
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            if (property == "user") {
                this.getContainer().style.display = value != null ? 'none' : null;
            } else if (property == "login-providers") {
                this.buildLoginButtons(value as LoginProviders);
            }else if(property == "app-station-name"){
                this.titleElement.innerHTML = value;
            }
        }
    }

    protected afterRendered() {
        this.getContainer().className = "app-station-login";
        this.titleElement = this.getContainer().querySelector(`#${this.getId()}-title`) as HTMLElement;
        this.getContainer().style.display = 'none';
    }

}