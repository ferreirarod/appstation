import * as firebase from "firebase";
import stateEngine from "./state-engine";
import Component from "./component";
import { Login, LoginProviders } from "./login";
import Content from "./content";
import Loading from "./loading";
import App from "./app";
import appGridService from "./app-grid-service";

export default class AppStation extends Component {

    private login: Login;

    private content: Content;

    private loading: Loading;

    private firstHashLoad: boolean;

    constructor(config: any, apps: Array<App>, loginProviders: LoginProviders, appName?: string) {
        super(document.body, "app-station");
        this.firstHashLoad = true;
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user: any) => {
            if (user) {
                stateEngine.set("user", user);
                stateEngine.set("available-apps", apps);
                appGridService.loadGrid();
            } else {
                stateEngine.set("user", null);
            }
        });
        if (appName != null && appName.trim().length != 0) {
            stateEngine.set("app-station-name", appName);
        }
        stateEngine.set("login-providers", loginProviders);
    }

    protected afterRendered() {
        this.login = new Login(this.getContainer(), `${this.getId()}-login`);
        this.content = new Content(this.getContainer(), `${this.getId()}-content`);
        this.loading = new Loading(this.getContainer(), `${this.getId()}-loading`);
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any): void => {
            if (property == "installed-apps" && this.firstHashLoad) {
                this.firstHashLoad = false;
                const hashChanged = () => {
                    const hash = new String(location.hash);
                    if (hash.trim().length != 0) {
                        const beginIndex: number = 1;
                        const indexOfSlash = hash.indexOf("\\");
                        const endIndex: number = indexOfSlash == -1 ? hash.length : indexOfSlash;
                        const appId = hash.substring(beginIndex, endIndex);
                        const installedApps = stateEngine.get("installed-apps") as Array<App>;
                        if (installedApps != null) {
                            installedApps.forEach(app => {
                                if (app.getId() == appId && app.isFullScreenApp()) {
                                    stateEngine.set("fullscreen-app", app);
                                }
                            })
                            return;
                        }
                    }
                    stateEngine.set("fullscreen-app", null);
                }
                onhashchange = hashChanged;
                hashChanged();
            }
        };
    }

}