import * as firebase from "firebase";
import stateEngine from "./state-engine";
import App from "./app";

new App(document.body, "app");

const config = {
    apiKey: "AIzaSyAwqLT6tZ9eKRATdUqF8F9KztqtWw3ADN8",
    authDomain: "test-760a6.firebaseapp.com",
    databaseURL: "https://test-760a6.firebaseio.com",
    projectId: "test-760a6",
    storageBucket: "test-760a6.appspot.com",
    messagingSenderId: "956449971829"
};

firebase.initializeApp(config);

firebase.auth().getRedirectResult().then((result) => {
    if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
        console.log(token);
    }
    // The signed-in user info.
    console.log(result.user);
    stateEngine.set("user", result.user);
}).catch((error) => {
    // Handle Errors here.
    //var errorCode = error.code;
    //var errorMessage = error.message;
    // The email of the user's account used.
    //var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    //var credential = error.credential;
    // ...
});