import * as firebase from "firebase";
import stateEngine from "./state-engine";
import App from "./app";

interface GridConfig {
    x: number,
    y: number,
    autoPosition: boolean,
    id: string
}

class AppGridService {

    public saveInstalledGrid() {
        const apps = stateEngine.get("installed-apps") as Array<App>;
        const userGrid = {
            apps: new Array<GridConfig>()
        }
        apps.forEach(app => {
            const gso = app.getGridStackOptions();
            userGrid.apps.push({ x: gso.x, y: gso.y, autoPosition: gso.autoPosition, id: gso.id });
        });
        firebase.database().ref('grid/' + firebase.auth().currentUser.uid).set(userGrid);
    }

    public loadGrid(): void {
        firebase.database().ref('/grid/' + firebase.auth().currentUser.uid).once('value').then(function (snapshot) {
            if (snapshot.val() != null) {
                const appsConfig = snapshot.val().apps as Array<GridConfig>;
                const newInstalledApps = new Array<App>();
                const availableApps = stateEngine.get("available-apps") as Array<App>;
                if (availableApps != null && availableApps.length != 0) {
                    appsConfig.forEach(cfg => {
                        const filtered = availableApps.filter(app => app.getId() == cfg.id);
                        if (filtered.length != 0) {
                            const app = filtered[0];
                            app.setX(cfg.x);
                            app.setY(cfg.y);
                            app.setAutoPosition(cfg.autoPosition);
                            newInstalledApps.push(app);
                        }
                    });
                    stateEngine.set("installed-apps", newInstalledApps);
                }
            }
        });
    }

}

const appGridService: AppGridService = new AppGridService();

export default appGridService;