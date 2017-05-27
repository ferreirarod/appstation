import Component from "./component";
import * as $ from "jquery";
import "gridstack.jQueryUI";

import "style-loader!gridstack/dist/gridstack.css";

export default class Grid extends Component {

    protected getInnerHTML(): string {
        return `<div class="grid-stack" data-gs-width="12" data-gs-animate="yes">
                </div>`;
    }

    protected afterRendered(){
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

    private serializeGridState(items:any[]){
        console.log(items);
    }

}