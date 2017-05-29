import Component from "./component";
import stateEngine from "./state-engine";
import App from "./app";
import appGridService from "./app-grid-service";

class AppList extends Component {

    private overlay: HTMLElement;

    protected getInnerHTML(): string {
        return `
            <div id="${this.getId()}-overlay" class="app-station-app-list-overlay"></div>
            <div id="${this.getId()}-apps" class="app-station-app-list-apps">
                <span id="${this.getId()}-title" class="app-station-app-list-title">Apps</span>
                <ul id="${this.getId()}-list-container" class="app-station-app-list-container">
                </ul>
            </div>
        `;
    }

    protected afterRendered(): void {
        this.setClass("app-station-app-list");
        this.overlay = this.getContainer().querySelector(`#${this.getId()}-overlay`) as HTMLDivElement;
        this.overlay.onclick = () => {
            stateEngine.set("app-list-menu-visible", false);
        };
        this.getContainer().style.display = 'none';
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            switch (property) {
                case "app-list-menu-visible":
                    this.getContainer().style.display = value ? null : 'none';
                    break;
                case "available-apps":
                    this.buildAppList(value as Array<App>);
                    break;
                case "installed-apps":
                    this.buildAppList(stateEngine.get("available-apps") as Array<App>);
                    break;
            }
        }
    }

    private buildAppList(apps: Array<App>): void {
        if (apps != null && apps.length != 0) {
            const ul = this.getContainer().querySelector(`#${this.getId()}-list-container`);
            if (ul.children.length != 0) {
                ul.querySelectorAll("li").forEach(li => {
                    ul.removeChild(li);
                });
            }
            apps.forEach(app => {
                const installedApps = stateEngine.get("installed-apps");
                const newInstalledApps = installedApps != null ? [...installedApps] : [];
                if (newInstalledApps.indexOf(app) != -1) {
                    return;
                }
                const li: HTMLLIElement = document.createElement("li");
                li.className = "app-station-list-container-item";
                li.innerHTML = `
                    <div>${app.getName()}</div>
                    <div>${app.getDescription()}</div>
                `;
                li.onclick = () => {
                    const installedApps = stateEngine.get("installed-apps");
                    const newInstalledApps = installedApps != null ? [...installedApps] : [];
                    newInstalledApps.push(app);
                    stateEngine.set("installed-apps", newInstalledApps);
                    appGridService.saveInstalledGrid();
                    stateEngine.set("app-list-menu-visible", false);
                }
                ul.appendChild(li);
            });
        }
    }

}

export default AppList;