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
var firebaseReady = false;

function isAuthenticated() {
    try {
        return !!(window.firebase && firebase.auth && firebase.auth().currentUser);
    } catch (e) {
        return false;
    }
}

function setAuthView(view) {
    document.body.classList.toggle("is-authenticated", view !== "login");
    document.body.classList.toggle("player-open", view === "player");
}

function showApp() {
    setAuthView("app");
    $("#main-login .content-loader").hide();
    $("#message").text("");
    if (typeof ajaxLoadPrograms === "function" && !allPrograms.length) {
        ajaxLoadPrograms();
    }
}

var LOGIN_FIELDS = ["email", "password", "login", "guest"];

function focusLoginControl(index) {
    var el = document.getElementById(LOGIN_FIELDS[index]);
    if (el && typeof el.focus === "function") {
        el.focus();
    }
}

function currentLoginIndex() {
    var active = document.activeElement;
    if (!active) {
        return -1;
    }
    for (var i = 0; i < LOGIN_FIELDS.length; i++) {
        if (active.id === LOGIN_FIELDS[i]) {
            return i;
        }
    }
    return -1;
}

function focusLoginStart() {
    if (currentLoginIndex() < 0) {
        focusLoginControl(2);
    }
}

function onLoginRemoteKey(event) {
    if (typeof isAuthenticated === "function" && isAuthenticated()) {
        return;
    }
    var key = event.keyCode || event.which;
    var name = event.key || "";
    var nav = window.keyRemoteControl && keyRemoteControl.NAVIGATION;
    var up = key === 38 || name === "ArrowUp" || (nav && key === nav.TOP);
    var down = key === 40 || name === "ArrowDown" || (nav && key === nav.DOWN);
    var left = key === 37 || name === "ArrowLeft" || (nav && key === nav.LEFT);
    var right = key === 39 || name === "ArrowRight" || (nav && key === nav.RIGTH);
    if (!up && !down && !left && !right) {
        return;
    }
    var index = currentLoginIndex();
    var onInput = index === 0 || index === 1;
    if (onInput && (left || right)) {
        return;
    }
    event.preventDefault();
    if (index < 0) {
        focusLoginControl(2);
        return;
    }
    if ((up || left) && index > 0) {
        focusLoginControl(index - 1);
    } else if ((down || right) && index < LOGIN_FIELDS.length - 1) {
        focusLoginControl(index + 1);
    }
}

function showLogin(message) {
    if (typeof destroyPlayer === "function") {
        destroyPlayer();
    }
    setAuthView("login");
    $("#main-login .content-loader").hide();
    if (message) {
        $("#message").text(message);
    }
    setTimeout(focusLoginStart, 0);
}

function showLoginLoader() {
    $("#main-login .content-loader").show();
}

function hideLoginLoader() {
    $("#main-login .content-loader").hide();
}

$(document).ready(function () {
    $("#login-form").on("submit", function (e) {
        e.preventDefault();
        login();
    });
    $("#guest").on("click", function (e) {
        e.preventDefault();
        guest();
    });
    document.addEventListener("keydown", onLoginRemoteKey, true);
    showLogin();
    if (typeof firebase === "undefined") {
        showLogin("No se pudo cargar el servicio de login. Revisá tu conexión e intentá de nuevo.");
        return;
    }
    try {
        initFirebase();
    } catch (error) {
        showLogin("No se pudo iniciar el servicio de login.");
    }
});

function initFirebase() {
    firebase.initializeApp(config);
    firebaseReady = true;
    firebase.auth().onAuthStateChanged(function (user) {
        hideLoginLoader();
        if (user) {
            saveSettings(settings.USER, JSON.stringify({
                email: user.email || "",
                uid: user.uid
            }));
            if (!document.body.classList.contains("is-authenticated")) {
                showApp();
            } else {
                hideLoginLoader();
            }
        } else {
            removeSettings(settings.USER);
            if (typeof allPrograms !== "undefined") {
                allPrograms = [];
            }
            $("#container_programs").empty();
            $("ul.nav-tabs").empty();
            showLogin();
        }
    });
}

function login() {
    var userEmail = (document.getElementById("email").value || "").trim();
    var userPassword = document.getElementById("password").value || "";
    if (!userEmail || !userPassword) {
        showLogin("Completá email y contraseña.");
        return false;
    }
    signWithFirebase(userEmail, userPassword);
    return false;
}

function signWithFirebase(email, password) {
    if (typeof firebase === "undefined" || !firebaseReady) {
        showLogin("El servicio de login no está disponible.");
        return;
    }
    showLoginLoader();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        hideLoginLoader();
        var message = "No se pudo iniciar sesión.";
        if (error && error.code === "auth/user-not-found") {
            message = "El usuario no existe.";
        } else if (error && error.code === "auth/wrong-password") {
            message = "Contraseña incorrecta.";
        } else if (error && error.code === "auth/invalid-email") {
            message = "El email no es válido.";
        } else if (error && error.message) {
            message = error.message;
        }
        $("#message").text(message);
    });
}

function guest() {
    signWithFirebase(USER_GUEST.email, USER_GUEST.password);
}

function logout() {
    if (typeof destroyPlayer === "function") {
        destroyPlayer();
    }
    allPrograms = [];
    $("#container_programs").empty();
    $("ul.nav-tabs").empty();
    removeSettings(settings.USER);
    if (typeof firebase === "undefined" || !firebase.auth) {
        showLogin();
        return;
    }
    firebase.auth().signOut().then(function () {
        showLogin();
    }).catch(function () {
        showLogin("No se pudo cerrar la sesión.");
    });
}
