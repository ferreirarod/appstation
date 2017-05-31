import Component from "./component";
import stateEngine from "./state-engine";
import * as firebase from "firebase";
import App from "./app";

export default class Header extends Component {

    private photo: HTMLSpanElement;
    private menu: HTMLElement;
    private fullscreenApp: HTMLElement;
    private apps: HTMLElement;
    private trash: HTMLElement;
    private titleElement: HTMLElement;

    protected getInnerHTML(): string {
        return `
            <svg id="${this.getId()}-menu" class="app-station-header-menu" version="1.0" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 128.000000 128.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" fill="#666" stroke="none"> <path d="M30 1253 c-8 -3 -18 -11 -22 -17 -13 -19 -9 -221 4 -234 17 -17 1239 -17 1256 0 15 15 16 216 2 238 -8 13 -89 15 -617 17 -334 1 -615 -1 -623 -4z"/> <path d="M12 758 c-16 -16 -16 -220 0 -236 17 -17 1239 -17 1256 0 16 16 16 220 0 236 -17 17 -1239 17 -1256 0z"/> <path d="M12 278 c-15 -15 -16 -216 -2 -238 8 -13 89 -15 630 -15 541 0 622 2 630 15 14 22 13 223 -2 238 -17 17 -1239 17 -1256 0z"/> </g> </svg>
            <span id="${this.getId()}-title" class="app-station-header-title">App Station <span id="${this.getId()}-fullscreen-app"></span></span>
            <span id="${this.getId()}-photo" class="app-station-header-photo"></span>
            <svg id="${this.getId()}-apps" class="app-station-header-apps" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="#666" id="Core" transform="translate(-340.000000, -4.000000)"><g id="apps" transform="translate(340.000000, 4.000000)"><path d="M0,4 L4,4 L4,0 L0,0 L0,4 L0,4 Z M6,16 L10,16 L10,12 L6,12 L6,16 L6,16 Z M0,16 L4,16 L4,12 L0,12 L0,16 L0,16 Z M0,10 L4,10 L4,6 L0,6 L0,10 L0,10 Z M6,10 L10,10 L10,6 L6,6 L6,10 L6,10 Z M12,0 L12,4 L16,4 L16,0 L12,0 L12,0 Z M6,4 L10,4 L10,0 L6,0 L6,4 L6,4 Z M12,10 L16,10 L16,6 L12,6 L12,10 L12,10 Z M12,16 L16,16 L16,12 L12,12 L12,16 L12,16 Z" id="Shape"/></g></g></g></svg>
            <svg  id="${this.getId()}-trash" class="app-station-header-trash" fill="#000000" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
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
        this.apps = this.getContainer().querySelector(`#${this.getId()}-apps`) as HTMLElement;
        this.apps.onclick = () => {
            //stateEngine.set("fullscreen-app", null);
            location.hash = '';
        }
        this.apps.style.display = 'none';
        this.trash = this.getContainer().querySelector(`#${this.getId()}-trash`) as HTMLElement;
        this.trash.style.display = 'none';
        this.titleElement = this.getContainer().querySelector(`#${this.getId()}-title`) as HTMLElement;
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
                if (value == null) {
                    this.fullscreenApp.style.display = 'none';
                    this.apps.style.display = 'none';
                } else {
                    this.fullscreenApp.style.display = null;
                    this.fullscreenApp.innerHTML = `\\\ ${(value as App).getName()}`;
                    this.apps.style.display = null;
                }
            } else if (property == "grid-dragging") {
                this.checkTrashDisplay(value as boolean);
            }else if(property == "app-station-name"){
                this.titleElement.innerHTML = value;
            }
        }
    }

    private checkTrashDisplay(gridDragging: boolean): void {
        if (gridDragging == true) {
            this.menu.style.display = 'none';
            this.titleElement.style.display = 'none';
            this.photo.style.display = 'none';
            this.trash.style.display = null;
        } else {
            this.menu.style.display = null;
            this.titleElement.style.display = null;
            this.photo.style.display = null;
            this.trash.style.display = 'none';
        }
    }

}