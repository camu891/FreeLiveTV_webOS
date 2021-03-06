
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
}

$(document).ready(function(){
    try {
        initFirebase();
    } catch(error) {
        var mainContent = $("#main-content");
        var mainLogin = $("#main-login");
        mainLogin.hide();
        mainContent.show();
    }
});

function initFirebase(){
    var userLocalStorage = JSON.parse(getSettings(settings.USER));
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function(user) {
        var isLogged = false;
        if (userLocalStorage){
            isLogged = true;
            user = userLocalStorage;
        } else if (user) {
            var user = firebase.auth().currentUser;
            var name, email, photoUrl, uid, emailVerified;
            //save user in localstorage
            saveSettings(settings.USER, JSON.stringify(user));
            if (user != null) {
                name = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                emailVerified = user.emailVerified;
                uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                // this value to authenticate with your backend server, if
                // you have one. Use User.getToken() instead.
                isLogged = true;
                if(email == USER_GUEST.email){
                    showAds();
                }
            }
        } else {
            // No user is signed in.
            isLogged = false;
        }
        $(".content-loader").hide();
        toggleLogin(isLogged,user)
    });
    
}

function showAds(){
    
}

function toggleLogin(isLogged, user){
    var mainLogin = $("#main-login");
    var mainContent = $("#main-content");
    if(isLogged || (user && user.email == USER_GUEST.email)){
        mainLogin.hide();
        mainContent.show();
    }else {
        mainLogin.show();
        mainContent.hide();
    }
}

function login() {
    var userEmail = document.getElementById('email').value;
    var userPassword = document.getElementById('password').value;
    signWithFirebase(userEmail,userPassword)
}

function signWithFirebase(email,password){
    $(".content-loader").show();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error: '+ errorMessage);
        $(".content-loader").hide();
    });
}

function createUser(email,password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error: '+ errorMessage);
        $(".content-loader").hide();
    });
}

function guest(){
    signWithFirebase(USER_GUEST.email,USER_GUEST.password)
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        removeSettings(settings.USER);
        $("#main-login").show();
        $("#main-content").hide();
    }).catch(function(error) {
        // An error happened.
        alert("Error: "+ error)
    });
}

