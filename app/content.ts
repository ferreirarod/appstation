import Component from "./component";
import Header from "./header";
import Grid from "./grid";

export default class AppContent extends Component {

    private grid: Grid;

    private header: Header;

    protected afterRendered() {
        this.header = new Header(this.getContainer(), "app-station-header");
        this.grid = new Grid(this.getContainer(), "app-station-grid");
        this.setClass("app-station-content");
        this.getContainer().style.display = 'none';
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            if (property == "user") {
                this.getContainer().style.display = value != null ? null : 'none';
            }
        }
    }

}