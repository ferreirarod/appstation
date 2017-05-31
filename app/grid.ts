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
        return `
            <div class="grid-stack" data-gs-width="12" data-gs-animate="yes"></div>
        `;
    }

    private removeItem(item: HTMLElement): void {
        const installedApps = stateEngine.get("installed-apps") as Array<App>;
        const newInstalledApps = new Array<App>();
        installedApps.forEach(app => {
            if (item.id != app.getId()) {
                newInstalledApps.push(app);
            }
        })
        stateEngine.set("installed-apps", newInstalledApps);
        appGridService.saveInstalledGrid();
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
            $('.grid-stack').on('removed', (event, items) => {
                for (var i = 0; i < items.length; i++) {
                    this.removeItem(items[i]);
                }
            });
            let overHeader = false;
            const mouseEnterHandler = () => {
                overHeader = true;
            }
            const mouseLeftHandler = () => {
                overHeader = false;
            }
            $('.grid-stack').on('dragstart', (event, items) => {
                overHeader = false;
                $('.app-station-header').on('mouseenter', mouseEnterHandler);
                $('.app-station-header').on('mouseleave', mouseLeftHandler);
            });
            $('.grid-stack').on('dragstop', (event, items) => {
                $('.app-station-header').off('mouseenter', mouseEnterHandler);
                $('.app-station-header').off('mouseleave', mouseLeftHandler);
                if(overHeader == true){
                    $('.grid-stack').data('gridstack').removeWidget(event.target as HTMLElement);
                }
            });
        });
        this.setClass("app-station-grid");
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            switch (property) {
                case "installed-apps":
                    this.syncApps(value as Array<App>);
                    break;
                case "fullscreen-app":
                    this.fullscreenApp(value as App);
                    break;
            }
        }
    }

    private fullscreenApp(app: App): void {
        const grid = $('.grid-stack').data('gridstack');
        if (app != null) {
            grid.disable();
            app.getContainer().classList.toggle("app-station-fullscreen");
            //app.getContainer().classList.toggle("grid-stack-item");
            app.getContentElement().classList.toggle("grid-stack-item-content")
            app.onFullScreen();
            document.querySelectorAll('.grid-stack-item').forEach((elem: HTMLElement) => {
                if (elem.id != app.getId()) {
                    elem.style.display = 'none';
                }
            });
        } else {
            grid.enableMove(true);
            const gridStackChildren = document.querySelector('.grid-stack').children;
            let toWidgetId: string = null;
            for (let i = 0; i < gridStackChildren.length; i++) {
                const current = gridStackChildren[i];
                if (current.classList.contains("app-station-fullscreen")) {
                    toWidgetId = current.id;
                    current.classList.toggle("app-station-fullscreen");
                    //current.classList.toggle("grid-stack-item");
                    current.children[0].classList.toggle("grid-stack-item-content")
                    continue;
                }
                (current as HTMLElement).style.display = null;
            }
            const availableApps = stateEngine.get("available-apps") as Array<App>;
            availableApps.forEach(app => {
                if (app.getId() == toWidgetId) {
                    this.registerOnClickEvent(app);
                    app.onWidget();
                }
            });
        }
    }

    private registerOnClickEvent(app: App): void {
        const handler = (event: JQueryEventObject, ui: any) => {
            $(app.getContainer()).off('click', handler);
            stateEngine.set("fullscreen-app", app);
        };
        $(app.getContainer()).on('click', handler);
    }

    private syncApps(apps: Array<App>): void {
        const grid = $('.grid-stack').data('gridstack');
        const items = document.querySelectorAll('.grid-stack-item');
        if (items.length != 0) {
            const toRemove: Array<String> = [];
            for (let i = 0; i < items.length; i++) {
                if (apps.filter(app => app.getId() == items[i].id).length == 0) {
                    toRemove.push(items[i].id);
                }
            }
            const availableApps: Array<App> = stateEngine.get("available-apps") as Array<App>;
            if (availableApps != null) {
                availableApps.forEach(app => {
                    if (toRemove.indexOf(app.getId()) != -1) {
                        grid.removeWidget(app.getContainer());
                        app.onWidgetRemoved();
                    }
                });
            }
        }
        apps.forEach(app => {
            if (document.querySelector(`#${app.getId()}`) == null) {
                const gridOptions = app.getGridStackOptions();
                grid.addWidget(app.getContainer(), gridOptions.x, gridOptions.y, gridOptions.width,
                    gridOptions.height, gridOptions.autoPosition, null, null, null, null, gridOptions.id);
                if (app.isFullScreenApp() == true) {
                    this.registerOnClickEvent(app);
                }
                app.onWidgetCreated();
                grid.resizable(app.getContainer(), false);
            }
        });
    }

    private serializeGridState() {
        const items = document.querySelectorAll('.grid-stack-item');
        if (items.length != this.widgetCount) {
            this.widgetCount = items.length;
        } else {
            const installedApps = stateEngine.get("installed-apps") as Array<App>;
            const newInstalledApps = new Array<App>();
            items.forEach(item => {
                const filtered = installedApps.filter(app => app.getId() == item.id);
                if (filtered != null && filtered.length != 0) {
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