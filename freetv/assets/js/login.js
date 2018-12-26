firebase.auth().onAuthStateChanged(function(user) {
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
            window.location.href = "./index.html";
        }
        
        
    } else {
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
    var userEmail = 'guest';
    var userPassword = 'userguest';
    signWithFirebase(userEmail,userPassword)
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });
}