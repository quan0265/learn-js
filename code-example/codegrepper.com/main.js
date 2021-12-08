
function saveImage(){
var search=getUrlParameter("search_term");
    search=search.replace(/\+/g, "");
    search=search.replace(/\s/g, "");
    search=search.toLowerCase();
    console.log(search);

html2canvas(document.querySelector(".CodeMirror")).then(canvas => {
 document.body.appendChild(canvas);
    theCanvas = canvas;
    canvas.toBlob(function(blob) {
    var name=search+".png";
    fetch(`/add_image.php?name=`+name, {method:"POST", body:blob})
    .then(response => console.log(response.text()))

    });

});
}


function showGrepperAnswer(search){
    getAnswers(search).then(function(answers){
    if(answers.length < 1){
       return; 
    }
    document.getElementById("grepper_answer_holder").style.display = "block";

    var answerTextarea = document.createElement("textarea");
    answerTextarea.textContent=answers[0].answer;
    answerTextarea.setAttribute("id","grepper_answer_textarea")


document.getElementById("grepper_answer").appendChild(answerTextarea);

var editorSelector = "#grepper_answer_textarea"; 
var languageGuess= languangeNametoCodeMirrorName(answers[0].language);
var answerCodeMirror = CodeMirror.fromTextArea(answerTextarea,{
            lineNumbers: true,
            theme:"prism-okaidia",
            mode: languageGuess,
            viewportMargin: Infinity,
           
});
/*
        window.rawCopping=true;
        document.addEventListener("copy", function(){
                // setTimeout(function(){
                if(window.rawCopping){
                        document.getElementById("your_welcome_holder").style.display = "block";
                }
                //}, 10);
        });

*/
new ClipboardJS('.copy_button', {
    text: function(trigger) {
        return getCodeMirrorNative(editorSelector).getDoc().getValue();
    }
});

    
document.getElementById("copy_button").addEventListener('click',function(){
window.rawCopping=false;
document.getElementById("copy_button").innerHTML="Copied";
    setTimeout(function(){
        document.getElementById("copy_button").innerHTML="Copy To Clipboard";
   //     document.getElementById("your_welcome_holder").style.display = "block";
    }, 500);//wait 2 seconds
}.bind());
           
      
      
      });
}

function getCodeMirrorNative(target) {
    var _target = target;
    if (typeof _target === 'string') {
        _target = document.querySelector(_target);
    }
    if (_target === null || !_target.tagName === undefined) {
        throw new Error('Element does not reference a CodeMirror instance.');
    }

    if (_target.className.indexOf('CodeMirror') > -1) {
        return _target.CodeMirror;
    }

    if (_target.tagName === 'TEXTAREA') {
        return _target.nextSibling.CodeMirror;
    }

    return null;
}; 

var search=getUrlParameter("search_term");
if(search){
    search=search.replace("+"," ");
    showGrepperAnswer(search);
}
function abortRequests () {
    if(window.currentHTTPRequest){
        window.currentHTTPRequest.abort();
    }
}


function makeRequest (method, url, data) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    window.currentHTTPRequest = xhr;
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if(method=="POST" && data){
        xhr.send(data);
    }else{
        xhr.send();
    }
  });
}



function getAnswers(search){
    console.log("getting answer for");
    console.log(search);
  var endpoint="https://www.codegrepper.com/api";
  return new Promise(function (resolve, reject) {
    makeRequest('GET', endpoint+"/index.php?s="+search+"&u=website&from_website=1").then(function(data){
        var results=JSON.parse(data);
        var languageGuess=results.language_guess;
        resolve(results.answers);
    }.bind(this));
  }.bind(this));
};

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function languangeNametoCodeMirrorName(l) {
    if(l === "php"){
        l="text/x-php" ;   
    }
    if(l === "java"){
        l="text/x-java" ;   
    }
    if(l === "python"){
        l="text/x-python" ;   
    }
    if(l === "cpp"){
        l="text/x-c++src" ;   
    }
    if(l === "c"){
        l="text/x-csrc" ;   
    }
    if(l === "css"){
        l="text/css" ;   
    }
    if(l === "html"){
        l="text/html" ;   
    }
    return l;
}

function dateToNiceDayString(myDate){
  var month=new Array();
  month[0]="Jan";
  month[1]="Feb";
  month[2]="Mar";
  month[3]="Apr";
  month[4]="May";
  month[5]="Jun";
  month[6]="Jul";
  month[7]="Aug";
  month[8]="Sep";
  month[9]="Oct";
  month[10]="Nov";
  month[11]="Dec";
  var hours = myDate.getHours();
  var minutes = myDate.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  //return myDate.getDate()+" "+month[myDate.getMonth()]+" "+myDate.getFullYear()+" "+strTime;
  return month[myDate.getMonth()]+" "+myDate.getDate()+" "+myDate.getFullYear();
}


function getAllLanguages(){
 var options={

         "abap":{"name":"Abap","enabled":0},
         "actionscript":{"name":"ActionScript","enabled":0},
         "assembly":{"name":"Assembly","enabled":0},
         "basic":{"name":"BASIC","enabled":0},
         "dart":{"name":"Dart","enabled":0},
         "clojure":{"name":"Clojure","enabled":0},
         "c":{"name":"C","enabled":1},
         "cobol":{"name":"Cobol","enabled":0},
         "cpp":{"name":"C++","enabled":1},
         "csharp":{"name":"C#","enabled":1},
         "css":{"name":"CSS","enabled":1},
         "delphi":{"name":"Delphi","enabled":0},
         "elixir":{"name":"Elixir","enabled":0},
         "erlang":{"name":"Erlang","enabled":0},
         "fortran":{"name":"Fortran","enabled":0},
         "fsharp":{"name":"F#","enabled":0},
         "go":{"name":"Go","enabled":0},
         "groovy":{"name":"Groovy","enabled":0},
         "haskell":{"name":"Haskell","enabled":0},
         "html":{"name":"Html","enabled":1},
         "java":{"name":"Java","enabled":1},
         "javascript":{"name":"Javascript","enabled":1},
         "julia":{"name":"Julia","enabled":0},
         "kotlin":{"name":"Kotlin","enabled":0},
         "lisp":{"name":"Lisp","enabled":0},
         "lua":{"name":"Lua","enabled":0},
         "matlab":{"name":"Matlab","enabled":0},
         "objectivec":{"name":"Objective-C","enabled":1},
         "pascal":{"name":"Pascal","enabled":0},
         "perl":{"name":"Perl","enabled":0},
         "php":{"name":"PHP","enabled":1},
         "postscript":{"name":"PostScript","enabled":0},
         "prolog":{"name":"Prolog","enabled":0},
         "python":{"name":"Python","enabled":1},
         "r":{"name":"R","enabled":0},
         "ruby":{"name":"Ruby","enabled":0},
         "rust":{"name":"Rust","enabled":0},
         "scala":{"name":"Scala","enabled":0},
         "scheme":{"name":"Scheme","enabled":0},
         "shell":{"name":"Shell/Bash","enabled":1},
         "smalltalk":{"name":"Smalltalk","enabled":0},
         "sql":{"name":"SQL","enabled":1},
         "swift":{"name":"Swift","enabled":1},
         "typescript":{"name":"TypeScript","enabled":1},
         "vb":{"name":"VBA","enabled":0},
         "webassembly":{"name":"WebAssembly","enabled":0},
         "whatever":{"name":"Whatever","enabled":1}
    };
    return options;
}

function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}

function jsUcfirst(string) {
    if(isNullString(string)){
            return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
}



function isNullString(str) {
    return (!str || 0 === str.length);
}
function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
};


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

if (typeof doPageLog !== 'undefined') {
makeRequest('GET', "/api/page_log.php?strat="+doPageLogStrat);
}


