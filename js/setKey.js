  var login = function(e) {
    if(e.keyCode !== 13 && e.currentTarget !== document.getElementById("login"))  return;  //accept on Enter key presses or lgin button pushed
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    data = {
      user: {
        "email": email, 
        "password": password
      },
      tool: "tags",
      platform: "google chrome"
    }
    testLogin(data);
  }
  
    var createXHTTP = function(callback) {
        var xhttp;
        if (window.XMLHttpRequest) {
           xhttp = new XMLHttpRequest();
        } else {
           xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = callback;
        return xhttp;
    };

//a few helper functions
    var testLogin = function(data) {
         var xhttp = createXHTTP( function(response) {
             if (xhttp.readyState == 4) {
                 if (xhttp.status == 200) {
                     chrome.storage.local.set({ 'apikey': JSON.parse(xhttp.responseText).key });
          	          window.location.href = "tags.html"
                 } else if (xhttp.status == 401) {
	           document.getElementById("message").innerHTML = "login invalid";
	      }
            }
        });
        xhttp.open('POST', 'https://tags.authorship.me/users/login', true);
//    xhttp.open('POST', 'http://tags.localhost.me:3000/users/login', true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader("Origin", window.top.location.href.split("?")[0]);
        xhttp.send(JSON.stringify( data ));
    };

window.onload=function(){
    document.getElementById("login").addEventListener('click', login);
    document.getElementById("password").addEventListener('keypress', login);
}
  
  
