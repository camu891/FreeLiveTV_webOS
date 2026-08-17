
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDMXt111zjEObH7mxzk6L-on8DnFTB2eBI",
    authDomain: "free-live-tv-905b4.firebaseapp.com",
    databaseURL: "https://free-live-tv-905b4.firebaseio.com",
    projectId: "free-live-tv-905b4",
    storageBucket: "free-live-tv-905b4.appspot.com",
    messagingSenderId: "16270322104"
};
var USER_GUEST = {
    email: "guest@guest.com",
    password: "userguest"
};

$(document).ready(function(){
    try {
        if (typeof firebase === "undefined") {
            enterWithoutFirebase();
            return;
        }
        initFirebase();
    } catch (error) {
        enterWithoutFirebase();
    }
});

function enterWithoutFirebase() {
    $("#main-login").hide();
    $("#main-content").show();
    $(".content-loader").hide();
}

function initFirebase(){
    var userLocalStorage = null;
    try {
        var rawUser = getSettings(settings.USER);
        userLocalStorage = rawUser ? JSON.parse(rawUser) : null;
    } catch (e) {
        userLocalStorage = null;
    }
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function(user) {
        var isLogged = false;
        if (userLocalStorage){
            isLogged = true;
            user = userLocalStorage;
        } else if (user) {
            var currentUser = firebase.auth().currentUser;
            saveSettings(settings.USER, JSON.stringify(currentUser));
            if (currentUser != null) {
                isLogged = true;
            }
        }
        $(".content-loader").hide();
        toggleLogin(isLogged, user);
    });
}

function toggleLogin(isLogged, user){
    var mainLogin = $("#main-login");
    var mainContent = $("#main-content");
    if (isLogged || (user && user.email == USER_GUEST.email)){
        mainLogin.hide();
        mainContent.show();
    } else {
        mainLogin.show();
        mainContent.hide();
    }
}

function login() {
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;
    signWithFirebase(userEmail, userPassword);
}

function signWithFirebase(email, password){
    $(".content-loader").show();
    if (typeof firebase === "undefined") {
        enterWithoutFirebase();
        return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        $("#message").text(error.message || "No se pudo iniciar sesión");
        $(".content-loader").hide();
    });
}

function guest(){
    if (typeof firebase === "undefined") {
        enterWithoutFirebase();
        return;
    }
    signWithFirebase(USER_GUEST.email, USER_GUEST.password);
}

function logout() {
    if (typeof firebase === "undefined" || !firebase.auth) {
        removeSettings(settings.USER);
        enterWithoutFirebase();
        $("#main-login").show();
        $("#main-content").hide();
        return;
    }
    firebase.auth().signOut().then(function() {
        removeSettings(settings.USER);
        $("#main-login").show();
        $("#main-content").hide();
    }).catch(function(error) {
        $("#message").text("Error: " + error);
    });
}
