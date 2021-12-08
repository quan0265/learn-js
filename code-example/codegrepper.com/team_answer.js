//var prod_api = "https://www.codegrepper.com/api";
var currentPage=1;
var langs=[];
var sort_by = "id_desc";

function deleteAnswer(id){
    var r = confirm("Are you sure you want to delete this answer?");
    if (r == true) {
            makeRequest('POST', prod_api+"/delete.php?id="+id+"&u="+ localStorage.getItem('user_id')).then(function(data){
            location.reload();
        }.bind(this));
    }

}
function loadBounties(page){
    document.getElementById("loading_holder").innerHTML=getLoadingHTML();

    page = typeof page !== 'undefined' ?  page : 1;

    currentPage=page;

    /*
    if(window.currentHTTPRequest){
        window.currentHTTPRequest.abort();    
    }
    */

    var table = document.getElementById("bounty_table");
    table.innerHTML = '<thead> <tr> <th> Search Term </th> <th >Answer <div id="answers_order_by_holder"> Sort: <select onchange="updateSortBy(this)" id="order_by"> <option value="id_desc">Date - Newest </option> <option value="id_asc">Date - Oldest </option> <option value="score_desc">Quality Score - Highest</option> <option value="score_asc">Quality Score - Lowest</option> <option value="view_desc"> Views - Highest </option> <option value="view_asc"> Views - Lowest </option> <option value="upvotes_desc"> Up Votes - Highest </option> <option value="upvotes_asc"> Up Votes - Lowest </option> <option value="downvotes_desc"> Down Votes - Highest </option> <option value="downvotes_asc"> Down Votes - Lowest </option> </select></div> </th> </tr> </thead>'; 

    document.getElementById("order_by").value=sort_by;

    var url=prod_api+"/get_team_answers.php?";
    if(document.getElementById("answer_search").value){

       url+="&search="+document.getElementById("answer_search").value;
    }

    var ls = document.getElementsByName("language_select");
    var language_filters = [];
    for(let i =0;i<ls.length;i++){
        if(ls[i].checked){
            language_filters.push(ls[i].value);
        }
    }

    if(language_filters.length){
        url+="&language_filters="+language_filters.join(",");
    }

    if(currentPage){
        url+="&offset="+((currentPage-1)*10);
    }

    if(sort_by){
        url+="&sort_by="+sort_by;
    }

    /*
    if(document.getElementById("include_upvotes").checked){
        url+="&include_upvotes=1";
    }
    */

    url+="&team_id="+getUrlParameter("id");

     makeRequest('GET',url).then(function(data){
      var answers_all=JSON.parse(data);
      var answers=answers_all.answers;

        var totalPending=0;
        var totalApproved=0;
        var totalPaid=0;
        var codeMirrorAnswers=[];
        for(let i=0;i<answers.length;i++){
              var row = table.insertRow(i+1);
             // var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(0);
              var cell3 = row.insertCell(1);
             // var cell4 = row.insertCell(3);

              //cell1.innerHTML=answers[i].created_at;
              cell2.innerHTML=answers[i].term;
              //cell2.style.width="300px";

              //cell3.innerHTML=answers[i].bounty;
              //cell4.innerHTML=(answers[i].bounty_approved) ? 'Public Answer' : 'Private Answer';


    var answerTextarea = document.createElement("textarea");
        answerTextarea.textContent=answers[i].answer;
        answerTextarea.classList.add("answer_texarea");

     // var t = answers[i].created_at.split(/[- :]/);
     // var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
     // var formattedDate=dateToNiceDayString(d);

     var mySelect =  document.createElement('select');
         mySelect.classList.add("grepper_answer_language_select");

         if(answers[i].is_others_answer){
            mySelect.disabled=true;
         }

         mySelect.addEventListener('change',function(el){
             answers[i].language=el.target.value;
         }.bind(this));


        for(let j=0;j<langs.ucl.length;j++){
            var selected="";
            if(answers[i].language == langs.ucl[j].lkey){
                selected = " selected='selected' ";
            }

            if(langs.ucl[j].enabled || selected){
                mySelect.innerHTML+="<option "+selected+" value="+langs.ucl[j].lkey+">"+langs.ucl[j].name+"</option>";
            }
           
         }
        
     var grepperOptionsHolder =  document.createElement('div');
         grepperOptionsHolder.classList.add("commando_answers_options_holder");

     var grepperOptionsHolderSpan =  document.createElement('span');
         grepperOptionsHolderSpan.classList.add("commando_answers_options_nickname");

         grepperOptionsHolderSpan.textContent= "By "+answers[i].fun_name + " on ";
         grepperOptionsHolderSpan.textContent+= answers[i].created_at;

     var grepperOptionsHolderSpan2 =  document.createElement('span');
         grepperOptionsHolderSpan2.classList.add("commando_answers_options_delete");
         grepperOptionsHolderSpan2.textContent= "Delete";

         if(answers[i].is_others_answer){
            grepperOptionsHolderSpan2.style.display = "none";
         }
         

         grepperOptionsHolderSpan2.addEventListener('click',function(){
            deleteAnswer(answers[i].id);
         }.bind(this));

        grepperOptionsHolder.appendChild(mySelect);
        grepperOptionsHolder.appendChild(grepperOptionsHolderSpan);

            grepperOptionsHolder.appendChild(grepperOptionsHolderSpan2);

        cell3.appendChild(grepperOptionsHolder);
        cell3.appendChild(answerTextarea);


        var html="";
        var t = answers[i].created_at.split(/[- :]/);
        var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        html+='<li class="my_answers_stats">';
        html+='<span  title="Quality Score" class="top_answers_quality_score"><i class="icon certificate brand_purple"></i>'+parseFloat(toInt(answers[i].score)).toFixed(1)+'</span>';
        html+='<span class="top_answers_views" title="'+toInt(answers[i].total_answer_hits)+' Views"><i class="icon eye brand_yellow"></i>'+toInt(answers[i].total_answer_hits)+'</span>';
        html+='<span class="top_answers_upvotes" title="'+toInt(answers[i].upvotes)+' Upvotes"><i class="icon thumbs up brand_green"></i>'+toInt(answers[i].upvotes)+'</span>';
        html+='<span class="top_answers_downvotes" title="'+toInt(answers[i].downvotes)+' Downvotes"><i class="icon thumbs down brand_red"></i>'+toInt(answers[i].downvotes)+'</span>';
        html+='<div style="clear:both"></div></li>';
        //cell3.innerHTML+=html;
        
             var saveButton = document.createElement('div');
                 saveButton.setAttribute("id","commando_save_answer_holder");
                 saveButton.innerHTML =html;
                 saveButton.innerHTML +='<button class="btn btn-light" id="commando_save_answer">Save Edits</button>';
                 cell3.appendChild(saveButton);
         
          if(answers[i].is_others_answer){
                saveButton.style.display="none";
          }



        codeMirrorAnswers[i]={};
        codeMirrorAnswers[i] = TaysCodeMirror.fromTextArea(answerTextarea,{
                    lineNumbers: true,
                    theme:"prism-okaidia",
                    mode: 'javascript',
                    viewportMargin: Infinity,
                   
        });

    saveButton.addEventListener('click',function(){
        var data={};
        data.answer=  codeMirrorAnswers[i].getValue();
        data.id=answers[i].id;
        data.language=answers[i].language;
        //console.log(data);
        //data.codeSearch=codeSearch;
        //data.source=2;
        //data.language = this.editorCurrentLanguageSelect.value;
        makeRequest('POST', prod_api+"/update_answer.php",JSON.stringify(data)).then(function(data){
            //location.reload();
        }.bind(this));
    }.bind(this));

    codeMirrorAnswers[i].setSize(600,null);

}


        document.getElementById("answers_order_by_holder").style.display="block";

        document.getElementById("loading_holder").innerHTML='';

        setupPagination(answers_all.total_count);
        
    });
}

function goToPage(p){
    abortRequests();
    loadBounties(p);
}

function setupPagination(c){
    var p = document.getElementsByClassName("pagination_holder");
    for(var t=0;t<p.length;t++){

    p[t].innerHTML="";
    var pages = Math.ceil(c/10);

    var html="";
    for(var i=1;i<=pages;i++){
        html+="<li ";
        if(currentPage === i){
            html+=" class='page-item active' ";   
        }else{
            html+=" class='page-item' ";   
        }
        html+=" onclick='goToPage("+i+")'> <a class='page-link'>"+i+"</a></li>";
    }

    p[t].innerHTML=html;

    }
    
}


document.getElementById("answer_search").addEventListener('keyup', function(event){
    //tset("my_answers_search",this.value);
    abortRequests();
    loadBounties();
});

/*
var languageSelects = document.getElementsByName("language_select");
for(let i =0;i<languageSelects.length;i++){
    languageSelects[i].addEventListener('change', function(){
        loadBounties();
    });
}
*/
function init(){
    makeRequest('GET',prod_api+"/get_user_code_languages.php").then(function(d){
        langs= JSON.parse(d);
        var html='<div id="filters" value="filters"> <div class="side_header">My Languages</div>';

        for (var i = 0; i < langs.ucl.length; i++) {
            if(langs.ucl[i].enabled){
            html+='<li><label><input onchange="abortRequests();loadBounties();" type="checkbox" name="language_select" value="'+langs.ucl[i].lkey+'">'+langs.ucl[i].name+'</label></li>';
            }
        }
        html+='<div class="side_header">All Languages</div>';
        for (var i = 0; i < langs.ucl.length; i++) {
            if(!langs.ucl[i].enabled){
            html+='<li><label><input onchange="abortRequests();loadBounties();" type="checkbox" name="language_select" value="'+langs.ucl[i].lkey+'">'+langs.ucl[i].name+'</label></li>';
            }
        }

        document.getElementById("languages_select_mine").innerHTML=html;

        loadBounties();
    });
}

function toInt(v){
    if(v == null){
        return 0;
    }
    return v;
}
function updateSortBy(el){
    sort_by = el.value;
    loadBounties();
}

//document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', function(){
    init();
});





