import Component from "./component";
import stateEngine from "./state-engine";

class AppList extends Component {

    private overlay: HTMLElement;

    protected getInnerHTML(): string {
        return `
            <div id="${this.getId()}-overlay" class="app-station-app-list-overlay"></div>
            <div id="${this.getId()}-apps" class="app-station-app-list-apps"></div>
        `;
    }

    protected afterRendered(): void {
        this.setClass("app-station-app-list");
        this.overlay = this.getContainer().querySelector(`#${this.getId()}-overlay`) as HTMLDivElement;
        this.overlay.onclick = () => {
            stateEngine.set("app-list-menu-visible", false);
        }
        this.getContainer().style.display = 'none';
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            if (property == "app-list-menu-visible") {
                this.getContainer().style.display = value? null : 'none';
            }
        }
    }

}

export default AppList;