import * as firebase from "firebase";
import stateEngine from "./state-engine";
import Component from "./component";
import Login from "./login";
import Content from "./content";
import Loading from "./loading";
import App from "./app";

export default class AppStation extends Component {

    private login: Login;

    private content: Content;

    private loading: Loading;

    private Apps: Array<App>;

    constructor(config: any, Apps: Array<App>) {
        super(document.body, "app-station");
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user: any) => {
            if (user) {
                stateEngine.set("user", user);
            } else {
                stateEngine.set("user", null);
            }
        });
    }

    protected afterRendered() {
        this.login = new Login(this.getContainer(), `${this.getId()}-login`);
        this.content = new Content(this.getContainer(), `${this.getId()}-content`);
        this.loading = new Loading(this.getContainer(), `${this.getId()}-loading`);
    }

}