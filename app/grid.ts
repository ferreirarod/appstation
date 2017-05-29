import Component from "./component";
import * as $ from "jquery";
import "gridstack.jQueryUI";
import App from "./app";

import "style-loader!gridstack/dist/gridstack.css";

export default class Grid extends Component {

    protected getInnerHTML(): string {
        return `<div class="grid-stack" data-gs-width="12" data-gs-animate="yes">
                    <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2"><div class="grid-stack-item-content">1</div></div>
                    <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4"><div class="grid-stack-item-content">2</div></div>
                    <div class="grid-stack-item" data-gs-x="8" data-gs-y="0" data-gs-width="2" data-gs-height="2" data-gs-min-width="2" data-gs-no-resize="yes"><div class="grid-stack-item-content"> <span class="fa fa-hand-o-up"></span> Drag me! </div></div>
                    <div class="grid-stack-item" data-gs-x="10" data-gs-y="0" data-gs-width="2" data-gs-height="2"><div class="grid-stack-item-content">4</div></div>
                    <div class="grid-stack-item" data-gs-x="0" data-gs-y="2" data-gs-width="2" data-gs-height="2"><div class="grid-stack-item-content">5</div></div>
                    <div class="grid-stack-item" data-gs-x="2" data-gs-y="2" data-gs-width="2" data-gs-height="4"><div class="grid-stack-item-content">6</div></div>
                    <div class="grid-stack-item" data-gs-x="8" data-gs-y="2" data-gs-width="4" data-gs-height="2"><div class="grid-stack-item-content">7</div></div>
                    <div class="grid-stack-item" data-gs-x="0" data-gs-y="4" data-gs-width="2" data-gs-height="2"><div class="grid-stack-item-content">8</div></div>
                    <div class="grid-stack-item" data-gs-x="4" data-gs-y="4" data-gs-width="4" data-gs-height="2"><div class="grid-stack-item-content">9</div></div>
                    <div class="grid-stack-item" data-gs-x="8" data-gs-y="4" data-gs-width="2" data-gs-height="2"><div class="grid-stack-item-content">10</div></div>
                    <div class="grid-stack-item" data-gs-x="10" data-gs-y="4" data-gs-width="2" data-gs-height="2"><div class="grid-stack-item-content">11</div></div>
                </div>`;
    }

    protected afterRendered() {
        $(() => {
            $('.grid-stack').gridstack({
                width: 12,
                alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            });
            const grid = $('.grid-stack').data('gridstack');
            // document.querySelectorAll('.grid-stack-item').forEach((item:HTMLElement) => {
            //     grid.resizable(item, false);
            // });
            $('.grid-stack').on('change', (event: JQueryEventObject, items: any[]) => {
                this.serializeGridState(items);
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
        apps.forEach(app => {
            const grid = $('.grid-stack').data('gridstack');
            const gridOptions = app.getGridStackOptions();
            grid.addWidget(app.getContainer(), gridOptions.x, gridOptions.y, gridOptions.width,
                gridOptions.height, gridOptions.autoPosition, null, null, null, null, gridOptions.id);
        });
    }

    private serializeGridState(items: any[]) {
        //console.log(items);
    }

}