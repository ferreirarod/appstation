import Component from "./component";
import * as $ from "jquery";
import "gridstack.jQueryUI";
import App from "./app";
import stateEngine from "./state-engine";
import appGridService from "./app-grid-service";

import "style-loader!gridstack/dist/gridstack.css";

export default class Grid extends Component {

    private widgetCount: number;

    constructor(parent: HTMLElement, id: string) {
        super(parent, id);
        this.widgetCount = 0;
    }

    protected getInnerHTML(): string {
        return `<div class="grid-stack" data-gs-width="12" data-gs-animate="yes"></div>`;
    }

    protected afterRendered() {
        $(() => {
            $('.grid-stack').gridstack({
                width: 12,
                alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            });
            $('.grid-stack').on('change', (event: JQueryEventObject, items: any[]) => {
                this.serializeGridState();
            });
        });
        this.setClass("app-station-grid");
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            switch (property) {
                case "installed-apps":
                    this.syncApps(value as Array<App>);
            }
        }
    }

    private syncApps(apps: Array<App>): void {
        const grid = $('.grid-stack').data('gridstack');
        const items = document.querySelectorAll('.grid-stack-item');
        if(items.length != 0){
            const toRemove: Array<String> = [];
            for(let i = 0; i < items.length; i++){
                if(apps.filter(app => app.getId() == items[i].id).length == 0){
                    toRemove.push(items[i].id);
                }
            }
            const availableApps: Array<App> = stateEngine.get("available-apps") as Array<App>;
            if(availableApps != null){
                availableApps.forEach(app => {
                    if(toRemove.indexOf(app.getId()) != -1){
                        grid.removeWidget(app.getContainer());
                        app.onWidgetRemoved();
                    }
                });
            }
        }
        apps.forEach(app => {
            if(document.querySelector(`#${app.getId()}`) == null){
                const gridOptions = app.getGridStackOptions();
                grid.addWidget(app.getContainer(), gridOptions.x, gridOptions.y, gridOptions.width,
                    gridOptions.height, gridOptions.autoPosition, null, null, null, null, gridOptions.id);
                app.onWidgetCreated();
                grid.resizable(app.getContainer(), false);
            }
        });
    }

    private serializeGridState() {
        const items = document.querySelectorAll('.grid-stack-item');
        if(items.length != this.widgetCount){
            this.widgetCount = items.length;
        }else{
            const installedApps = stateEngine.get("installed-apps") as Array<App>;
            const newInstalledApps = new Array<App>();
            items.forEach(item => {
                const filtered = installedApps.filter(app => app.getId() == item.id);
                if(filtered != null && filtered.length != 0){
                    const app = filtered[0];
                    app.setX(parseInt(item.getAttribute("data-gs-x")));
                    app.setY(parseInt(item.getAttribute("data-gs-y")));
                    app.setAutoPosition(false);
                    newInstalledApps.push(app);
                }
            })
            stateEngine.set("installed-apps", newInstalledApps);
            appGridService.saveInstalledGrid();
        }
    }

}