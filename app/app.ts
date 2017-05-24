import Component from "./component";
import Login from "./login";
import * as $ from "jquery";
import "gridstack.jQueryUI";

import "gridstack/dist/gridstack.css";

export default class App extends Component {

    private login: Login;

    protected getInnerHTML(): string {
        return `<h1>My Awesome App :)</h1>
        
             <section id="demo" class="darklue">
                <div class="container">
                    <div class="grid-stack" data-gs-width="12" data-gs-animate="yes">
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
                    </div>
                </div>
            </section>
        `;
    }

    protected afterRendered(){
        this.login = new Login(this.getContainer(), "login");
        $(function () {
            $('.grid-stack').gridstack({
                width: 12,
                alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                resizable: {
                    handles: 'e, se, s, sw, w'
                }
            });
        });
    }

}