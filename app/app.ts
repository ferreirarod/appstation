import Component from "./component";
import Login from "./login";
import Content from "./content";
import Loading from "./loading";

export default class App extends Component {

    private login: Login;

    private content: Content;

    private loading: Loading;

    protected afterRendered(){
        this.login = new Login(this.getContainer(), "app-station-login");
        this.content = new Content(this.getContainer(), "app-station-content");
        this.loading = new Loading(this.getContainer(), "app-station-loading");
    }

}