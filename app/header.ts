import Component from "./component";
import stateEngine from "./state-engine";
import * as firebase from "firebase";

export default class Header extends Component {

    private photo: HTMLSpanElement;

    protected getInnerHTML(): string{
        return `
            <span id="${this.getId()}-photo" class="app-station-header-photo"></span>
        `;
    }

    protected afterRendered(): void{
        this.setClass("app-station-header");
        this.photo = this.getContainer().querySelector(`#${this.getId()}-photo`) as HTMLSpanElement;
        this.photo.onclick = () => {
            firebase.auth().signOut().then(function() {
                stateEngine.set("user", null);
            }).catch(function(error) {
            // An error happened.
            });
        }
    }

    protected onStateChange(): (state: Object, property: string, value: any) => void {
        return (state: Object, property: string, value: any) => {
            if (property == "user") {
                if(value != null){
                    this.photo.style.content = `url(${value.photoURL})`;
                }
            }
        }
    }

}