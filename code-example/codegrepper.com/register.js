function save_login(data) {
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('access_token', data.access_token);

    var event = new CustomEvent("user_registered", { "detail": data });
    document.dispatchEvent(event);

    //if we registered or logged in we will set us to user_type plugin
    if (getURLParameterByName("uts") == "plugin") {
        makeRequest("GET", "/api/update_user_type.php?user_type=plugin").then(function() {

            if (parseInt(data.user_id) % 2 == 0) {
                //evens go to welcome
                window.location = "/app/welcome.php";
            } else {
                //odds go to tutorial 
                window.location = "/tutorial.php?st=1";
            }

        });
    } else {
        if (window.isGrepperLogin) {
            window.location = "/app/index.php";
        } else {
            window.location = "/app/welcome.php";
        }
    }

    if (typeof isCheckoutPage !== 'undefined') {
        createPaymentIntent();
        document.getElementById("google_register_box").style.display = "none";
        document.getElementById("payment_form_holder").style.display = "block";

    }
}

function hideLoading() {
    if (document.getElementById("grepper_loading_ring_holder")) {
        var element = document.getElementById("grepper_loading_ring_holder");
        element.parentNode.removeChild(element);

    }
}


function showLoading() {
    if (document.getElementById("grepper_loading_ring_holder")) {
        return;
    }

    var spinnerIconHolder = document.createElement("div");
    spinnerIconHolder.setAttribute("id", 'grepper_loading_ring_holder');

    var spinnerIcon = document.createElement("div");
    spinnerIcon.setAttribute("id", 'grepper_loading_ring');

    spinnerIconHolder.appendChild(spinnerIcon);

    document.body.appendChild(spinnerIconHolder);
}


function register(formData) {
    showLoading();


    if (getURLParameterByName("uts") == "plugin") {
        formData.append("uts", "plugin");
    }

    if (typeof isCheckoutPage !== 'undefined') {
        formData.append("is_checkout_page", 1);
    }


    var url = "/api/register.php";
    if (window.isGrepperLogin) {
        url = "/api/login.php";
    }

    if (typeof makeRequest !== "function") {
        // This function exists
        function makeRequest(method, url, data) {
            var id = localStorage.getItem('user_id');
            var token = localStorage.getItem('access_token');
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                window.currentHTTPRequest = xhr;
                xhr.open(method, url);
                if (typeof id !== 'undefined') {
                    xhr.setRequestHeader("x-auth-id", id);
                }
                if (typeof token !== 'undefined') {
                    xhr.setRequestHeader("x-auth-token", token);
                }
                xhr.onload = function() {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };
                xhr.onerror = function() {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };
                if (method == "POST" && data) {
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        }
    }

    makeRequest('POST', url, formData).then(function(d) {
        hideLoading();
        var data = JSON.parse(d);
        if (!data.success) {
            document.getElementById("login_error_holder").style.display = "block";
            var errorsHolder = document.getElementById("errors");
            errorsHolder.innerHTML = '<h5>Oops, there was a problem. Please fix the below errors.</h5>';
            for (var i = 0; i < data.errors.length; i++) {
                errorsHolder.innerHTML += '<li>' + data.errors[i] + '</li>';
            }

            //logout of goo
            var auth2 = gapi.auth2.getAuthInstance();
            if (auth2.isSignedIn.get()) {
                auth2.signOut();
                auth2.disconnect();
            }

        } else {
            save_login(data);
        }
    });
}

document.getElementById("register_form").addEventListener("submit", function(e) {

    var form = document.querySelector('#register_form');
    var formData = new FormData(form);
    register(formData);
    e.preventDefault(); //stop form from submitting
    //do whatever an submit the form
});

/*
document.getElementById("register_button").addEventListener('click',function(){
    register();
});
*/

function renderSigninButton() {
    gapi.load('auth2', function() {
        /* Ready. Make a call to gapi.auth2.init or some other API */
        gapi.auth2.init({ client_id: '276024493641-c112g6aqcrc4bt62clgm8oasrbkomj8j.apps.googleusercontent.com' }).then(function(auth2) {
            if (auth2.isSignedIn.get()) {

                var googleUserIdToken = auth2.currentUser.get().getAuthResponse().id_token;
                //so what to do if we are google signed in
                //if we are signed in we should be logging in always 
                //(it could be first login though)
                //Question what should we do, if it's there first isntall
                //and they are google logged in?
                doAutoLogin(googleUserIdToken);
            } else {
                gapi.signin2.render('gSignInRegister', {
                    'scope': 'profile email',
                    'width': 320,
                    'height': 50,
                    'longtitle': true,
                    'theme': 'light',
                    'onsuccess': onSuccess,
                    'onfailure': onFailure
                });
            }
        });
    });
}

//if we pass a google User then its a google login
function doAutoLogin(googleUserIdToken) {
    googleUserIdToken = (typeof googleUserIdToken !== 'undefined') ? googleUserIdToken : false

    setIsLoginStatus(1);

    var form = document.querySelector('#register_form');
    var formData = new FormData(form);
    if (googleUserIdToken) {
        formData.append("id_token", googleUserIdToken);
    }
    register(formData);
}

// Sign-in success callback
//question how do we know if we are loging in or registering here???
//this should only be called if we are not signed in
function onSuccess(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var formData = new FormData();
    formData.append("id_token", id_token);
    //formData.append("user_id",document.getElementById("grepper_user_id").value);
    //formData.append("chrome_grepper_id",document.getElementById("grepper_register_chrome_grepper_id").value);
    register(formData);
}

// Sign-in failure callback
function onFailure(error) {
    //alert(error);
    console.log(error);
}

// Sign out the user
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {});
    auth2.disconnect();
}

function setIsLoginStatus(isLogin) {
    // if(document.getElementById('grepper_user_id')){
    //     document.getElementById('grepper_user_id').value=localStorage.getItem("user_id");
    // }
    // if(document.getElementById('grepper_register_chrome_grepper_id')){
    //     document.getElementById('grepper_register_chrome_grepper_id').value=localStorage.getItem("chrome_id");
    // }

    var errorsHolder = document.getElementById("login_error_holder");
    if (errorsHolder) {
        errorsHolder.style.display = "none";
    }
    window.isGrepperLogin = isLogin;
    if (isLogin) {
        document.getElementById("register_header_1").innerHTML = "Log in to Grepper";
        document.getElementById("register_button").innerHTML = "Log in";
        document.getElementById("tos_aggree").style.display = "none";
        document.getElementById("already_have_accout").textContent = "Don't have an Account?";
        document.getElementById("register_or_login_button").textContent = "Create Account";
        document.getElementById("register_or_login_button").onclick = function() {
            setIsLoginStatus(0);
        }

        //setTimeout(function(){
        var googleButtonHack = document.getElementsByClassName('abcRioButtonContents');
        if (googleButtonHack && googleButtonHack[0] && googleButtonHack[0].children && googleButtonHack[0].children[0]) {
            var googleButtonHackSpan = googleButtonHack[0].children[0];
            googleButtonHackSpan.textContent = "Sign in with Google";
        }
        // }, 1000);//wait 2 seconds for button to render
    } else {
        document.getElementById("register_header_1").innerHTML = "Welcome to Grepper";
        document.getElementById("register_button").innerHTML = "Sign up";
        document.getElementById("tos_aggree").style.display = "block";
        document.getElementById("already_have_accout").textContent = "Already have an account?";
        document.getElementById("register_or_login_button").textContent = "Login";
        document.getElementById("register_or_login_button").onclick = function() {
            setIsLoginStatus(1);
        }

        setTimeout(function() {
            var googleButtonHack = document.getElementsByClassName('abcRioButtonContents');
            if (googleButtonHack && googleButtonHack[0] && googleButtonHack[0].children && googleButtonHack[0].children[0]) {
                var googleButtonHackSpan = googleButtonHack[0].children[0];
                googleButtonHackSpan.textContent = "Sign up with Google";
            }
        }, 1000); //wait 2 seconds for button to render

    }
}

function getURLParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}