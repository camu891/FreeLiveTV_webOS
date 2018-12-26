// Initialize Firebase
var config = {
    apiKey: "AIzaSyDMXt111zjEObH7mxzk6L-on8DnFTB2eBI",
    authDomain: "free-live-tv-905b4.firebaseapp.com",
    databaseURL: "https://free-live-tv-905b4.firebaseio.com",
    projectId: "free-live-tv-905b4",
    storageBucket: "free-live-tv-905b4.appspot.com",
    messagingSenderId: "16270322104"
};
firebase.initializeApp(config);

var contentLogin = document.getElementsByClassName("content-login")


firebase.auth().onAuthStateChanged(function(user) {
 $(".content-login").hide();
    if (user) {
        
        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;
        
        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            $("#iframe-login").hide();
            $("#main-content").show();
        }
        
        
    } else {
        $(".content-login").show();
        // No user is signed in.
    }
});

function login() {
    var userEmail = document.getElementById('email').value;
    var userPassword = document.getElementById('password').value;
    signWithFirebase(userEmail,userPassword)
}

function signWithFirebase(email,password){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error: '+ errorMessage);
    });
}

function createUser(email,password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error: '+ errorMessage);
    });
}

function guest(){
    var userEmail = 'guest@guest.com';
    var userPassword = 'userguest';
    signWithFirebase(userEmail,userPassword)
}

function logout() {
    console.log("logout")
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        $("#iframe-login").show();
        $("#main-content").hide();
    }).catch(function(error) {
        // An error happened.
        alert("Error: "+ error)
    });
}

