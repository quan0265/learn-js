
function grepperAnswer() {
  this.endpoint="https://www.codegrepper.com/api";
  this.codeSearch={};
  this.user_id='';
  this.access_token='';
  this.lastSavedTime=false;
  this.lastSavedSelection=false;
  this.currentEditorLanguage="whatever";
  this.showingEditor=false;
  this.fastLoad = false;
  this.loadedCodeMirrorModes=[];
  this.showingEditor=false;
}

grepperAnswer.prototype.languageToSelect =function(){

    this.editorCurrentLanguageSelect  = document.createElement('select');
    this.editorCurrentLanguageSelect.setAttribute("id","languange_guess_display");
    this.editorCurrentLanguageSelect.addEventListener('change',function(){
            var l=this.editorCurrentLanguageSelect.value;
            this.languangeNametoTaysCodeMirrorName(l,function(mimeType){
            this.codeEditor.setOption("mode", mimeType);
        }.bind(this));
    }.bind(this));

    getLanguageSelectOptions(function(options){
        this.guessCodeLanguage(options);//this sets this.currentEditorLanguage
        var l=this.currentEditorLanguage;

        for (var key in options) {
              var opt = document.createElement('option');
                opt.value = key;
                opt.textContent = options[key];
                if(l===key){
                    opt.setAttribute("selected", "selected");
                }
                this.editorCurrentLanguageSelect.appendChild(opt);
        }
    }.bind(this),this);
}

grepperAnswer.prototype.init=function(){

    var classname = document.getElementsByClassName("add_grepper_answer_button_web");
    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', function(){
            this.showEditor("",9);
        }.bind(this), false);
    }
}

grepperAnswer.prototype.closeEditor=function(){
    this.showingEditor = false;
    var editor=  document.getElementById("web-grepper-editor");
    editor.parentNode.removeChild(editor);
}

grepperAnswer.prototype.setDefaultSearchTerm=function(){

    if(document.getElementById("grepper_browse_search_term")){
        this.codeSearch.search= document.getElementById("grepper_browse_search_term").value;
    }else{
        this.codeSearch.search= getParameterByName("q");
    }

    if(document.getElementById("grepper_browse_language")){
        this.currentEditorLanguage= document.getElementById("grepper_browse_language").value;
    }else{
        this.currentEditorLanguage= "whatever";
    }
}

grepperAnswer.prototype.showEditor=function(content, answerSource){

this.setDefaultSearchTerm();


answerSource = (typeof answerSource !== 'undefined') ? answerSource : 5;

if(this.showingEditor){
    return;    
}
 this.showingEditor=true;

 var that=this;
 var taysPopup = document.createElement("div");
     taysPopup.classList.add("web_tays_popup")
     taysPopup.setAttribute("id","web-grepper-editor");

     taysPopup.addEventListener('mousedown',function(event){
         if(event.target === this){
            that.closeEditor();
         }
     });

 var taysPopupInner = document.createElement("div");
     taysPopupInner.classList.add("web_tays_popup_inner")

 var taysPopupTextAreaHolder = document.createElement("div");
     taysPopupTextAreaHolder.classList.add("web_tays_popup_textarea_holder")

 var taysPopupCloseButton = document.createElement("div");
     taysPopupCloseButton.classList.add("web_tays_popup_close_button")
     taysPopupCloseButton.textContent="X";
     taysPopupCloseButton.title="Close";

     taysPopupCloseButton.addEventListener('click',function(){
         
         that.closeEditor();
     });


 var grepperAnswerCustomTitle = document.createElement("input");
     grepperAnswerCustomTitle.setAttribute("id","web_grepper_answer_title");
     grepperAnswerCustomTitle.value=this.codeSearch.search;
     grepperAnswerCustomTitle.addEventListener('change',function(){
        var newV=document.getElementById("web_grepper_answer_title").value;
        this.codeSearch.search=newV;
    }.bind(this));


 var taysPopupHeader1 = document.createElement("div");
     taysPopupHeader1.classList.add("web_tays_popup_header1")
     taysPopupHeader1.textContent="Your Grepper Answer to: “";
     taysPopupHeader1.appendChild(grepperAnswerCustomTitle);

     var rightQuote = document.createElement("span");
         rightQuote.textContent="”";
         taysPopupHeader1.appendChild(rightQuote);




    this.taysPopupSourceHolder = document.createElement("div");
    this.taysPopupSourceHolder.setAttribute("id","web_tays_popup_source_holder");

    this.taysPopupSourceHolderLabel = document.createElement("span");
    this.taysPopupSourceHolderLabel.textContent="Source:";
    this.taysPopupSourceHolderLabel.setAttribute("id","web_tays_popup_source_holder_label");
    this.taysPopupSourceHolder.appendChild(this.taysPopupSourceHolderLabel);

    //add in the source input
    this.addSourceButton = document.createElement("a");
    this.addSourceButton.textContent = "Add Source";
    this.addSourceButton.title = "Add Source";
    this.addSourceButton.setAttribute("id","web_tays_add_source_button");

    this.taysPopupSourceText = document.createElement("span");
    this.taysPopupSourceText.setAttribute("id","web_tays_popup_source_text");
    this.taysPopupSourceText.title = "Edit Source";


    this.taysPopupSourceInput = document.createElement("input");
    //this.taysPopupSourceInput.value=window.location.href;
    this.taysPopupSourceInput.setAttribute("id","web_tays_popup_source_input");
    this.taysPopupSourceInput.setAttribute("placeholder","http://www.your-source-website.com");
    this.taysPopupSourceInput.value = window.location.href;


    this.taysPopupSourceInputDelete = document.createElement("span");
    this.taysPopupSourceInputDelete.setAttribute("id","web_tays_popup_source_delete_button");
    this.taysPopupSourceInputDelete.textContent="x";
    this.taysPopupSourceInputDelete.title = "Delete Source";
    this.taysPopupSourceInputDelete.style.display = "none";

    this.taysPopupSourceInputCheck = document.createElement("span");
    this.taysPopupSourceInputCheck.setAttribute("id","web_tays_popup_source_check_button");
    this.taysPopupSourceInputCheck.textContent="✓";
    this.taysPopupSourceInputCheck.title = "Set Source";
    this.taysPopupSourceInputCheck.style.display = "none";







    this.taysPopupSourceHolder.appendChild(this.addSourceButton);
    this.taysPopupSourceHolder.appendChild(this.taysPopupSourceText);
    this.taysPopupSourceHolder.appendChild(this.taysPopupSourceInput);
    this.taysPopupSourceHolder.appendChild(this.taysPopupSourceInputCheck);
    this.taysPopupSourceHolder.appendChild(this.taysPopupSourceInputDelete);


    var that=this;


    this.addSourceButton.addEventListener('click',function(){
        that.addSourceButton.style.display="none";
        that.taysPopupSourceHolderLabel.style.display="inline-block";
        that.taysPopupSourceText.style.display="none";
        that.taysPopupSourceInput.style.display="inline-block";
        that.taysPopupSourceInputDelete.style.display="inline-block";
        that.taysPopupSourceInputCheck.style.display="inline-block";
        that.taysPopupSourceInput.focus();
    });

    this.taysPopupSourceText.addEventListener('click',function(){
        that.taysPopupSourceText.style.display="none";
        that.taysPopupSourceInput.style.display="inline-block";
        that.taysPopupSourceInputDelete.style.display="inline-block";
        that.taysPopupSourceInputCheck.style.display="inline-block";
        that.taysPopupSourceInput.focus();
    });


    //Basically clearing this input out
    this.taysPopupSourceInputDelete.addEventListener('click',function(){
            that.taysPopupSourceInput.value = '';
            that.taysPopupSourceText.textContent = that.taysPopupSourceInput.value;
            that.taysPopupSourceText.style.display="none";
            that.taysPopupSourceInput.style.display="none";
            that.taysPopupSourceInputDelete.style.display="none";
            that.taysPopupSourceInputCheck.style.display="none";
            that.taysPopupSourceHolderLabel.style.display="none";
            that.addSourceButton.style.display="inline-block";
    });


    this.taysPopupSourceInputCheck.addEventListener('click',function(){
            doneSettingsSource();
    });

    this.taysPopupSourceInput.addEventListener('keyup',function(event){
        if (event.key === "Enter") {
            doneSettingsSource();
        }
    });


   function doneSettingsSource(){
        if(!that.taysPopupSourceInput.value){
            that.taysPopupSourceText.textContent = that.taysPopupSourceInput.value;
            that.taysPopupSourceText.style.display="none";
            that.taysPopupSourceInput.style.display="none";
            that.taysPopupSourceInputDelete.style.display="none";
            that.taysPopupSourceInputCheck.style.display="none";
            that.taysPopupSourceHolderLabel.style.display="none";
            that.addSourceButton.style.display="inline-block";
        }else{
            if(that.isValidSource(that.taysPopupSourceInput.value)){
                that.taysPopupSourceText.textContent = that.maxLength(that.taysPopupSourceInput.value,64);
                that.taysPopupSourceText.style.display="inline-block";
                that.taysPopupSourceInput.style.display="none";
                that.taysPopupSourceInputDelete.style.display="none";
                that.taysPopupSourceInputCheck.style.display="none";
            }else{
                alert("Hmm, that source is not a valid URL. Be sure to use full url. ex: http://www.mywebsite.com/mypage.php");
            }
        }
   }

   //this is the default
// this.taysPopupSourceText.textContent =this.maxLength(window.location.href,64);
// this.taysPopupSourceText.style.display="inline-block";
// this.taysPopupSourceInput.style.display="none";
// this.taysPopupSourceInputDelete.style.display="none";
// this.taysPopupSourceInputCheck.style.display="none";
// this.addSourceButton.style.display="none";
// this.taysPopupSourceHolderLabel.style.display="inline-block";
            that.taysPopupSourceInput.value = '';
            that.taysPopupSourceText.textContent = that.taysPopupSourceInput.value;
            that.taysPopupSourceText.style.display="none";
            that.taysPopupSourceInput.style.display="none";
            that.taysPopupSourceInputDelete.style.display="none";
            that.taysPopupSourceInputCheck.style.display="none";
            that.taysPopupSourceHolderLabel.style.display="none";
            that.addSourceButton.style.display="inline-block";




    //taysPopupInner.appendChild(taysPopupBlacklistHideShow);
    //taysPopupInner.appendChild(taysPopupBlacklist);
    taysPopupInner.appendChild(taysPopupCloseButton);
    taysPopupInner.appendChild(taysPopupTextAreaHolder)


    taysPopup.appendChild(taysPopupInner);

    this.codeEditorTextarea = document.createElement("textarea");
    this.codeEditorTextarea.innerHTML=content;


var languageGuessDisplayHolder = document.createElement("div");
    languageGuessDisplayHolder.setAttribute("id","web_languange_guess_display_holder");

  //add the team options
    this.teams=[];
    /*
    makeRequest('GET', "/api/get_my_teams.php?u="+this.user_id,{},this.user_id,this.access_token).then(function(data){
     this.teams=JSON.parse(data);
     if(this.teams.length > 0){

         this.teamsHolder = document.createElement("div");
         this.teamsHolder.setAttribute("id","web_grepper_teams_icon_holder");
         this.teamIcons=[];
         for(var i=0;i<this.teams.length;i++){
         this.teamIcons[i]= document.createElement("div");
         this.teamIcons[i].classList.add("web_grepper_team_select_icon_holder");
         this.teamIcons[i].setAttribute("grepper_team_name",this.teams[i].name);
         this.teamIcons[i].setAttribute("grepper_team_id",this.teams[i].id);

         if(this.teams[i].add_to_team){
             this.teamIcons[i].classList.add("web_grepper_team_icon_active");
             this.teamIcons[i].title="Adding answer to team "+this.teams[i].name;
         }else{
             this.teamIcons[i].title="Select to add answer to team "+this.teams[i].name;
         }

         this.teamIcons[i].addEventListener('click',function(){
             if(this.classList.contains("web_grepper_team_icon_active")){
                this.classList.remove("web_grepper_team_icon_active");
                this.title="Select to add answer to team "+this.getAttribute("grepper_team_name");
             }else{
                this.classList.add("web_grepper_team_icon_active");
                this.title="Adding answer to team "+this.getAttribute("grepper_team_name");
             }
         });

            var img=  document.createElement("img");
                img.src="https://www.codegrepper.com/team_images/50_50/"+this.teams[i].profile_image;

            this.teamIcons[i].appendChild(img);
            this.teamsHolder.appendChild(this.teamIcons[i]);
         }

        languageGuessDisplayHolder.appendChild(this.teamsHolder);
        languageGuessDisplayHolder.style.marginTop="12px";
    }

    }.bind(this));
    */





    this.languageToSelect();
    languageGuessDisplayHolder.appendChild(this.editorCurrentLanguageSelect);

    taysPopupTextAreaHolder.appendChild(taysPopupHeader1);
    taysPopupTextAreaHolder.appendChild(languageGuessDisplayHolder);
    taysPopupTextAreaHolder.appendChild(this.codeEditorTextarea);
    taysPopupTextAreaHolder.appendChild(this.taysPopupSourceHolder)


 var taysPopupSaveButtonHolder = document.createElement("div");

 var taysPopupSaveButtonBottomNav = document.createElement("div");
     taysPopupSaveButtonBottomNav.classList.add("web_grepper_bottom_nav");

 var taysPopupSaveButton = document.createElement("div");
     taysPopupSaveButton.classList.add("web_grepper_save_button");
     taysPopupSaveButton.textContent = "Save Grepper Answer";

     taysPopupSaveButton.addEventListener('click',function(){

           if(!that.codeSearch.search || that.codeSearch.search.length < 3){
                document.getElementById("web_grepper_answer_title").style.border="1px solid red";
                alert("Please enter the search term that you are answering.");
                return false;
           }


        var answer=that.codeEditor.getValue();
          if(!answer || answer.length < 6){
                alert("Hmmm, this answer is a little too short. Make sure your putting in a helpful answer.");

                 that.codeEditor.focus();
                 document.getElementsByClassName("TaysCodeMirror")[0].style.border="2px solid red";
                return false;
           }

        that.saveAnswer(answer,answerSource);
        that.closeEditor();
        //that.showGrepperAnswerSavedDialog();
     });

    taysPopupSaveButtonBottomNav.appendChild(taysPopupSaveButton);
    taysPopupSaveButtonHolder.appendChild(taysPopupSaveButtonBottomNav);

    taysPopupInner.appendChild(taysPopupSaveButtonHolder);

    document.body.appendChild(taysPopup);


    this.languangeNametoTaysCodeMirrorName(
    this.currentEditorLanguage,
    function(mimeType){
                 this.codeEditor = TaysCodeMirror.fromTextArea(this.codeEditorTextarea,{
                      lineNumbers: true,
                      theme:"prism-okaidia",
                      mode:mimeType,
                      viewportMargin: Infinity
                });
                 //this.codeEditor.setValue("\n\n\n");
                 this.codeEditor.focus();
    }.bind(this));

    if(!this.codeSearch.search){
        document.getElementById("web_grepper_answer_title").focus();

    }
   
}



function getLangaugeSearchTerms(){
    var terms=[
        {"name":"php","terms":["php"]},
        {"name":"javascript","terms":["javascript","js","java script","javscript"]},
        {"name":"typescript","terms":["typescript","ts","type script"]},
        {"name":"css","terms":["css"]},
        {"name":"html","terms":["html"]},
        {"name":"sql","terms":["sql","mysql"]},
        {"name":"java","terms":["java"]},
        {"name":"python","terms":["python"]},
        {"name":"cpp","terms":["cpp","c++"]},
        {"name":"shell","terms":["linux","shell","install","git","ubuntu","upgrade"]},
        {"name":"objectivec","terms":["objectivec","objective c","obj c","objc"]},
        {"name":"swift","terms":["swift"]},
        {"name":"csharp","terms":["c#","csharp","c #","c sharp"]},
        {"name":"ruby","terms":["ruby"]},
        {"name":"kotlin","terms":["kotlin"]},
        {"name":"javascript","terms":["jquery","viewjs","json","angular","express","redux","ajax","node","node js","node.js","nodejs","electron","reactjs","react js","react"]},
        {"name":"python","terms":["django","pandas","flask"]},
        {"name":"php","terms":["laravel"]},
        {"name":"csharp","terms":["asp.net","asp .net","asp net",".net"]},
        {"name":"ruby","terms":["rails"]},
        {"name":"assembly","terms":["assembly"]},
        {"name":"scala","terms":["scala"]},
        {"name":"dart","terms":["dart"]},
        {"name":"elixir","terms":["elixir"]},
        {"name":"clojure","terms":["clojure"]},
        {"name":"webassembly","terms":["webassembly","web assembly"]},
        {"name":"fsharp","terms":["fsharp","f#","f #","f sharp"]},
        {"name":"erlang","terms":["erlang"]},
        {"name":"matlab","terms":["matlab","mat lab"]},
        {"name":"fortran","terms":["fortran"]},
        {"name":"perl","terms":["perl"]},
        {"name":"groovy","terms":["groovy"]},
        {"name":"julia","terms":["julia"]},
        {"name":"prolog","terms":["prolog"]},
        {"name":"pascal","terms":["pascal"]},
        {"name":"postscript","terms":["postscript","post script"]},
        {"name":"smalltalk","terms":["smalltalk"]},
        {"name":"actionscript","terms":["actionscript","action script"]},
        {"name":"basic","terms":["basic"]},
        {"name":"lisp","terms":["lisp"]},
        {"name":"abap","terms":["abap"]},
        {"name":"delphi","terms":["delphi"]},
        {"name":"vb","terms":["visual basic","vb.net","vb net"]},
        {"name":"lua","terms":["lua"]},
        {"name":"go","terms":["go"]}
   ];

    return terms;
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

function getLanguageSelectOptions(callback,that) {
    ///api/get_user_code_languages.php
    //var options=getAllLanguages();
    makeRequest('GET', "/api/get_user_code_languages.php").then(function(data){
        var items_data = JSON.parse(data);
        var items=items_data.ucl;
        var myOptions={};
        for (var i =0;i<items.length;i++) {
            //push language into select if its the current language
            if(items[i].enabled || that.currentEditorLanguage === items[i].lkey){
                myOptions[items[i].lkey]=items[i].name;
            }
        }
        callback(myOptions);
    });
}

grepperAnswer.prototype.maxLength=function(str,length){
    return str.length > length ? str.substring(0, length) + "..." : str;
}

grepperAnswer.prototype.languangeNametoTaysCodeMirrorName =function(l,callback) {
  var mode =["javascript"]

  if(l === "javascript"){ l="text/javascript" ; mode=["javascript"];}
  if(l === "php"){ l="text/x-php" ; mode=["clike","javascript","htmlmixed","css","php"];}
  if(l === "java"){ l="text/x-java" ;mode=["clike"];  }
  if(l === "csharp"){ l="text/x-csharp" ;mode=["clike"];  }
  if(l === "python"){ l="text/x-python" ;mode=["python"];  }
  if(l === "swift"){ l="text/x-swift" ;mode=["swift"];  }
  if(l === "objectivec"){ l="text/x-objectivec" ;mode=["clike"];}
  if(l === "cpp"){ l="text/x-c++src" ;mode=["clike"];  }
  if(l === "c"){ l="text/x-csrc" ;mode=["clike"];  }
  if(l === "css"){ l="text/css" ;mode=["css"];  }
  if(l === "html"){ l="text/html" ;mode=["xml","javascript","css","htmlmixed"];  }
  if(l === "shell"){ l="text/x-sh";mode=["shell"];  }
  if(l === "sql"){ l="text/x-mysql";mode=["sql"];  }
  if(l === "typescript"){ l="application/typescript";mode=["javascript"];  }
  if(l === "ruby"){ l="text/x-ruby" ;mode=["ruby"];  }
  if(l === "kotlin"){ l="text/x-kotlin" ;mode=["clike"];  }
  if(l === "go"){ l="text/x-go";mode=["go"];  }
  if(l === "assembly"){ l="text/x-gas";mode=["gas"]; }
  if(l === "r"){ l="text/x-rsrc";mode=["r"]; }
  if(l === "vb"){ l="text/x-vb";mode=["vb"]; }
  if(l === "scala"){ l="text/x-scala";mode=["clike"]; }
  if(l === "rust"){ l="text/x-rust";mode=["rust"]; }
  if(l === "dart"){ l="text/x-dart";mode=["dart"]; }
  if(l === "elixir"){ l="text/javascript";mode=["javascript"]; }
  if(l === "clojure"){ l="text/x-clojure";mode=["clojure"]; }
  if(l === "webassembly"){ l="text/javascript";mode=["javascript"]; }
  if(l === "fsharp"){ l="text/x-fsharp";mode=["mllike"]; }
  if(l === "erlang"){ l="text/x-erlang";mode=["erlang"]; }
  if(l === "haskell"){ l="text/x-haskell";mode=["haskell"]; }
  if(l === "matlab"){ l="text/javascript";mode=["javascript"]; }
  if(l === "cobol"){ l="text/x-cobol";mode=["cobol"]; }
  if(l === "fortran"){ l="text/x-fortran";mode=["fortran"]; }
  if(l === "scheme"){ l="text/x-scheme";mode=["scheme"]; }
  if(l === "perl"){ l="text/x-perl";mode=["perl"]; }
  if(l === "groovy"){ l="text/x-groovy";mode=["groovy"]; }
  if(l === "lua"){ l="text/x-lua";mode=["lua"]; }
  if(l === "julia"){ l="text/x-julia";mode=["julia"]; }
  if(l === "delphi"){ l="text/javascript";mode=["javascript"]; }
  if(l === "abap"){ l="text/javascript";mode=["javascript"]; }
  if(l === "lisp"){ l="text/x-common-lisp";mode=["commonlisp"]; }
  if(l === "prolog"){ l="text/javascript";mode=["javascript"]; }
  if(l === "pascal"){ l="text/x-pascal";mode=["pascal"]; }
  if(l === "postscript"){ l="text/javascript";mode=["javascript"]; }
  if(l === "smalltalk"){ l="text/x-stsrc";mode=["smalltalk"]; }
  if(l === "actionscript"){ l="text/javascript";mode=["javascript"]; }
  if(l === "basic"){ l="text/javascript";mode=["javascript"]; }


    var total=0;
    for(var i=0;i<mode.length;i++){
        this.injectScript('/app/codemirror/mode/'+mode[i]+'/'+mode[i]+'.js', 'body', function(){
            total++;
            if(total === mode.length){
                callback(l);
            }
        });
    }
}

grepperAnswer.prototype.injectScript = function(file, node ,callback) {
    console.log(file);
  if(this.loadedCodeMirrorModes.indexOf(file) === -1){
           this.loadedCodeMirrorModes.push(file);

          var js_script = document.createElement('script');
              js_script.src = file; 
            document.body.appendChild(js_script);
            callback();

   }else{
       callback();
   }
}

grepperAnswer.prototype.startsWith=function(str,word){
    return str.lastIndexOf(word, 0) === 0;
}

grepperAnswer.prototype.saveAnswer=function(answerText,source){

       if(!source){ source = 2;}

       var data={};
        data.answer=answerText;
        data.user_id=this.user_id;
        data.codeSearch=this.codeSearch;
        data.source=source;

        if(this.taysPopupSourceInput.value && this.isValidSource(this.taysPopupSourceInput.value)){
            data.source_url=this.taysPopupSourceInput.value;
        }else{
            data.source_url="";
        }

        if(this.editorCurrentLanguageSelect){
            data.language =this.editorCurrentLanguageSelect.value;
        }

        //save answer to teams
        if(this.teams.length){
             data.team_ids=[];
             for(var i=0;i<this.teamIcons.length;i++){
                 if(this.teamIcons[i].classList.contains("grepper_team_icon_active")){
                     data.team_ids.push(this.teamIcons[i].getAttribute("grepper_team_id"));
                 }
             }
        }

        makeRequest('POST', "/api/save_answer.php?from_web=1",JSON.stringify(data)).then(function(responseData){
            //location.reload();
         var dataR=JSON.parse(responseData);
            if(dataR.payment_required){
                var r = confirm("Oops! Looks like you need to activate Grepper, Activate now?");
                if (r == true) {
                    window.open("https://www.codegrepper.com/checkout/checkout.php", "_blank");
                }
            }else{
                this.showGrepperAnswerSavedDialog();
                window.onbeforeunload = function () {
                    window.scrollTo(0, 0);
                }
                location.reload();
            }
        }.bind(this));


}

grepperAnswer.prototype.showGrepperAnswerSavedDialog=function(){

     var dialog = document.createElement("div");
     dialog.setAttribute("id","web_grepper_flash_message");
     dialog.textContent="Grepper Answer Saved!";
     document.body.appendChild(dialog);

  setTimeout(function(){
    dialog.parentNode.removeChild(dialog);
  },2000);
}

grepperAnswer.prototype.isValidSource=function(str){
   if(!str){
       return false;
   }
  if(!this.startsWith(str,"http://") && !this.startsWith(str,"https://")){
        return false;
  }
  var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null);
}

grepperAnswer.prototype.guessCodeLanguage=function(options){

    var term =this.codeSearch.search;
    var allTerms = getLangaugeSearchTerms();
    var allPossibleTerms= [];

     //getLanguageSelectOptions(function(options){

         for(var i =0;i< allTerms.length;i++){
            if((typeof options[allTerms[i].name]) !== 'undefined'){
                allPossibleTerms.push(allTerms[i]);
            }
         }

         //now try to find the answer
         for(var i =0;i< allPossibleTerms.length;i++){
             for(var j =0;j< allPossibleTerms[i].terms.length;j++){
                if( (term.toLowerCase().indexOf(allPossibleTerms[i].terms[j]+" ") !== -1) || (term.toLowerCase().indexOf(" "+allPossibleTerms[i].terms[j]) !== -1)) {
                    this.currentEditorLanguage = allPossibleTerms[i].name;  return;
                }
             }
         }

        //this.currentEditorLanguage = 'whatever';  return;

    //}.bind(this));

}


var grepperAnswerModel = new grepperAnswer();
    grepperAnswerModel.init();




