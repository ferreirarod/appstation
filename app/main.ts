import * as firebase from "firebase";
import stateEngine from "./state-engine";
import App from "./app";
import config from "./firebase-config";

import "style-loader!./style.css";

new App(document.body, "app");

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user:any) =>{
  if (user) {
    stateEngine.set("user", user);
  } else {
    stateEngine.set("user", null);
  }
});