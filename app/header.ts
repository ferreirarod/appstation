import Component from "./component";
import stateEngine from "./state-engine";
import * as firebase from "firebase";
import App from "./app";

export default class Header extends Component {

    private photo: HTMLSpanElement;

    private menu: HTMLElement;

    private fullscreenApp: HTMLElement;

    protected getInnerHTML(): string {
        return `
            <svg id="${this.getId()}-menu" class="app-station-header-menu" version="1.0" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 128.000000 128.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" fill="#666" stroke="none"> <path d="M30 1253 c-8 -3 -18 -11 -22 -17 -13 -19 -9 -221 4 -234 17 -17 1239 -17 1256 0 15 15 16 216 2 238 -8 13 -89 15 -617 17 -334 1 -615 -1 -623 -4z"/> <path d="M12 758 c-16 -16 -16 -220 0 -236 17 -17 1239 -17 1256 0 16 16 16 220 0 236 -17 17 -1239 17 -1256 0z"/> <path d="M12 278 c-15 -15 -16 -216 -2 -238 8 -13 89 -15 630 -15 541 0 622 2 630 15 14 22 13 223 -2 238 -17 17 -1239 17 -1256 0z"/> </g> </svg>
            <span id="${this.getId()}-title" class="app-station-header-title">App Station <span id="${this.getId()}-fullscreen-app"></span></span>
            <span id="${this.getId()}-photo" class="app-station-header-photo"></span>
        `;
    }

    protected afterRendered(): void {
        this.setClass("app-station-header");
        this.photo = this.getContainer().querySelector(`#${this.getId()}-photo`) as HTMLSpanElement;
        this.photo.onclick = () => {
            firebase.auth().signOut().then(function () {
                stateEngine.set("user", null);
            }).catch(function (error) {
                // An error happened.
            });
        }
        this.menu = this.getContainer().querySelector(`#${this.getId()}-menu`) as HTMLElement;
        this.menu.onclick = () => {
            stateEngine.set("app-list-menu-visible", true);
        }
        this.fullscreenApp = this.getContainer().querySelector(`#${this.getId()}-fullscreen-app`) as HTMLElement;
        this.fullscreenApp.style.display = 'none';
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            if (property == "user") {
                if (value != null) {
                    this.photo.style.content = `url(${value.photoURL})`;
                }
            } else if (property == "installed-apps") {
                const availableApps = stateEngine.get("available-apps") as Array<App>;
                if (value != null && availableApps != null) {
                    this.menu.style.display = (value as Array<App>).length == availableApps.length ? 'none' : null;
                }
            } else if (property == "fullscreen-app") {
                if(value == null){
                    this.fullscreenApp.style.display = 'none';
                }else{
                    this.fullscreenApp.style.display = null;
                    this.fullscreenApp.innerHTML = `\\\ ${(value as App).getName()}`;
                }
            }
        }
    }

}