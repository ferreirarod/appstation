import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyAwqLT6tZ9eKRATdUqF8F9KztqtWw3ADN8",
    authDomain: "test-760a6.firebaseapp.com",
    databaseURL: "https://test-760a6.firebaseio.com",
    projectId: "test-760a6",
    storageBucket: "test-760a6.appspot.com",
    messagingSenderId: "956449971829"
};

firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

provider.setCustomParameters({
    'login_hint': 'user@example.com'
});

firebase.auth().getRedirectResult().then(function (result) {
    if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
    }
    // The signed-in user info.
    var user = result.user;
}).catch(function (error) {
    firebase.auth().signInWithRedirect(provider);
    // Handle Errors here.
    //var errorCode = error.code;
    //var errorMessage = error.message;
    // The email of the user's account used.
    //var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    //var credential = error.credential;
    // ...
});