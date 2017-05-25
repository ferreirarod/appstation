import * as firebase from "firebase";
import stateEngine from "./state-engine";
import App from "./app";
import config from "./firebase-config";

new App(document.body, "app");

firebase.initializeApp(config);

const user = firebase.auth().currentUser;

if (user) {
    stateEngine.set("user", user);
} else {
    stateEngine.set("user", null);
}

firebase.auth().onAuthStateChanged((user:any) =>{
  if (user) {
    stateEngine.set("user", user);
  } else {
    stateEngine.set("user", null);
  }
});