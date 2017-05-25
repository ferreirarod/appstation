import Component from "./component";
import Login from "./login";
import AppGrid from "./app-grid";

export default class App extends Component {

    private login: Login;

    private appGrid: AppGrid;

    protected afterRendered(){
        this.login = new Login(this.getContainer(), "login");
        this.appGrid = new AppGrid(this.getContainer(), "appGrid");
    }

}