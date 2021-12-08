var data;//make this a gloval
//var user_id = getParameterByName("id"); 
var my_user_id = document.getElementById("my_user_id").value;

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function init() {

    //get_belt_rank();
    if((typeof user_id === 'undefined') && my_user_id){
        window.location.href = "/app/profile.php?id="+my_user_id;
    }

    restore_options();

    if(user_id == my_user_id){
        document.getElementById("editProfileButton").style.display="block";
        document.getElementById('profile_container').addEventListener('click', selectFileToUpload);
        document.getElementById('profile_image_edit_show').style.display="block";
        document.getElementById('profile_container').style.cursor="pointer";
        document.getElementById('followButton').style.display="none";
    }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_belt_rank(user){
    makeRequest('GET',prod_api+"/get_user_stats.php?uid="+user_id).then(function(d){
        var stats= JSON.parse(d);
        document.getElementById("overall_belt_color").innerHTML=capitalizeFirstLetter(stats.coding_belt[0]);
        document.getElementById("overallbelt").className+=" "+stats.coding_belt[0];
        document.getElementById("belt_system_holder").style.display="block";
    });
}


function showHelpedStats() {
 makeRequest('GET', prod_api+"/profile_helped_stats.php?id="+user_id).then(function(d){
       var data=JSON.parse(d);
        document.getElementById("developers_helped_text").textContent=data.developers_helped;
        document.getElementById("hits_text").textContent=data.hits;
 });
}

function showTopAnswers() {
 makeRequest('GET', prod_api+"/profile_top_answers.php?id="+user_id).then(function(d){
       data=JSON.parse(d);
        var html="";
        for (let i = 0; i < data.top_answers.length; i++) {
            var t = data.top_answers[i].created_at.split(/[- :]/);
            var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
            var formattedDate=dateToNiceDayString(d);

            html+='<li>';

            html+='<span  title="Quality Score" class="top_answers_quality_score"><i class="icon certificate brand_purple"></i>'+parseFloat(data.top_answers[i].score).toFixed(1)+'</span>';
            html+='<span  title="Views" class="top_answers_views"><i class="icon eye brand_yellow"></i>'+data.top_answers[i].total_results+'</span>';
            html+='<span title="Upvotes" class="top_answers_upvotes"><i class="icon thumbs up brand_green"></i>'+data.top_answers[i].upvotes+'</span>';
            html+='<span   title="Downvotes" style="margin-right:0px;" class="top_answers_downvotes"><i class="icon thumbs down brand_red"></i>'+data.top_answers[i].downvotes+'</span>';
            html+='<a  onclick="showAnswer(this,'+i+')" class="top_answers_search_term">'+data.top_answers[i].search_term+' <i class="answer_more_icon icon angle right"></i> </a> <div class="top_answer_date lighter smaller">'+formattedDate+'</div>';
            html+='<div style="clear:both"></div></li>';
        }
		document.getElementById("top_answers").innerHTML = html;

 });
}

function restore_options() {
    showHelpedStats();
    showTopAnswers();
    makeRequest('GET', prod_api+"/profile.php?id="+user_id).then(function(d){
       var data=JSON.parse(d);

      //document.getElementById("developers_helped_text").textContent=data.developers_helped;
      //document.getElementById("hits_text").textContent=data.hits;

        if(data.profile_image){
            document.getElementById("profile_image_edit").src="/profile_images/"+data.profile_image;
        }


        if(data.fun_name){
            document.getElementById("page_title").textContent=data.fun_name+"'s Profile";
            document.getElementById("fun_name_input").value=data.fun_name;
        var userNameEls = document.getElementsByClassName("username_text");
        for(var i =0;i<userNameEls.length;i++){
            userNameEls[i].textContent = data.fun_name;
        }


        }

        if(data.real_name){

    document.getElementById("real_name_holder").style.display="block";
        document.getElementById("real_name_text").textContent=data.real_name;
        document.getElementById("real_name_input").value=data.real_name;
        }

        if(data.twitter_name){

    document.getElementById("twitter_name_text").textContent="@"+data.twitter_name;
    document.getElementById("twitter_name_text").href="https://twitter.com/"+htmlEntities(data.twitter_name);
    document.getElementById("twitter_name_text_holder").style.display="block";
            
    document.getElementById("twitter_name_input").value=data.twitter_name;
        }

        if(data.location){

    document.getElementById("location_text").textContent=data.location;
    document.getElementById("location_text_holder").style.display="block";
            
    document.getElementById("location_input").value=data.location;
        }

        if(data.donate_link){

            document.getElementById("help_with_donate").style.display="block";
            document.getElementById("help_with_no_donate").style.display="none";
            document.getElementById("donate_link_text_holder").style.display="block";
            document.getElementById("donate_link_text").href=data.donate_link;

            document.getElementById("donate_link_input").value=data.donate_link;
        }
         if(data.how_to_help){
            document.getElementById("how_to_help_text").textContent=data.how_to_help;
            document.getElementById("how_to_help_input").value=data.how_to_help;
        }

       if(document.getElementById("coding_activity_box")){
         
            if(data.enable_coding_activity){
                document.getElementById("coding_activity_is_enabled_holder").style.display="block";
            }

            if(user_id == my_user_id || data.is_activity_private !=1){
                document.getElementById("coding_activity_box").style.display="block";
                document.getElementById("coding_activity_box_br").style.display="block";
            }
            if(user_id == my_user_id || data.is_daily_activity_private !=1){
                document.getElementById("user_historical_coding_activity_holder").style.display="block";
            }
        }

        //show edit privacy if its me 
        if(user_id == my_user_id){
            showRankPrivacy(data.is_rank_private);
            showActivityEnabled(data.enable_coding_activity);
            showActivityPrivacy(data.is_activity_private);
            showExpertisePrivacy(data.is_expertise_private);
            showDailyActivityPrivacy(data.is_daily_activity_private);
        }

    });


}


function showAnswer2(el,i){
	var ts = el.parentElement.getElementsByTagName('textarea');
    var icon=el.parentElement.getElementsByClassName("answer_more_icon");

    
    if(ts.length) {
        icon[0].classList.add("right");
        icon[0].classList.remove("down");

		el.parentElement.removeChild(ts[0]);
        var l=el.parentElement.lastChild;
		el.parentElement.removeChild(l);
		return;
	}else{
        icon[0].classList.add("down");
        icon[0].classList.remove("right");
    }
   


 var textArea = document.createElement('textArea');
	 textArea.textContent = userDailyActivity[i].answer;
	 el.parentElement.appendChild(textArea);

        TaysCodeMirror.fromTextArea(textArea,{
			lineNumbers: true,
			theme:"prism-okaidia",
			mode: 'javascript',
			viewportMargin: Infinity,
        });
	
}

function showAnswer(el,i){
	var ts = el.parentElement.getElementsByTagName('textarea');
    var icon=el.parentNode.getElementsByClassName("answer_more_icon");

    if(ts.length) {
        icon[0].classList.add("right");
        icon[0].classList.remove("down");

		el.parentNode.removeChild(ts[0]);
        var l=el.parentElement.lastChild;
		el.parentNode.removeChild(l);
		return;
	}else{
        icon[0].classList.add("down");
        icon[0].classList.remove("right");
    }


 var textArea = document.createElement('textArea');
	 textArea.textContent = data.top_answers[i].answer;
	 el.parentElement.appendChild(textArea);

        TaysCodeMirror.fromTextArea(textArea,{
			lineNumbers: true,
			theme:"prism-okaidia",
			mode: 'javascript',
			viewportMargin: Infinity,
        });
	
}

function selectFileToUpload(){
    document.getElementById('profile_image_input').click();
}


document.addEventListener('DOMContentLoaded', init);

document.getElementById('profile_image_input').addEventListener('change',function(){
      if (this.files && this.files[0]) {
            var extensions = ["image/jpg","image/jpeg","image/png","image/gif"];
            if(extensions.indexOf(this.files[0].type) === -1){
                alert("Oops! Try uploading a png, jpg or gif image instead.");
                return;
            }
            if(this.files[0].size > 10000000){
                alert("Yikes! That file is a little too big, try something under 10MB");
                return;
            }

            var img = document.getElementById('profile_image_edit');
                img.src = URL.createObjectURL(this.files[0]);

            var formData = new FormData();
                formData.append('file', this.files[0]);
                formData.append('update', 'profile_image');

                makeRequest('POST', prod_api+"/profile.php",formData).then(
                function(r){
                },
                function(r){
                    if(r.status==413){
                        alert("Oops, That image file is too large. Max size is 8mb");
                    }
                }
                );

      }
});


/*
function  saveTwitterName(event,clickedElement){

var v = document.getElementById("twitter_name_input").value;
        document.getElementById("twitter_name_text").textContent = v;

var formData = new FormData();
    formData.append('twitter_name',v);
    formData.append('update', 'twitter_name');
    makeRequest('POST', prod_api+"/profile.php",formData);

    clickedElement.parentElement.classList.remove("show_input"); 
    event.stopPropagation();
    return false;

}


function  saveRealName(event,clickedElement){

var v = document.getElementById("real_name_input").value;
        document.getElementById("real_name_text").textContent = v;

var formData = new FormData();
    formData.append('real_name',v);
    formData.append('update', 'real_name');
    makeRequest('POST', prod_api+"/profile.php",formData);

    clickedElement.parentElement.classList.remove("show_input"); 
    event.stopPropagation();
    return false;
}

*/


function showCodingActivityHelpVideo(){
    document.getElementById("code_activity_help_video").style.display = "block";
}

function editProfile(){
    document.getElementById("edit_profile_popup").style.display = "block";
}

function startsWith(str, word) {
    return str.lastIndexOf(word, 0) === 0;
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

document.getElementById('save_profile').addEventListener('click', function(){
        //lets fix the paypal url if they input it without https
        var paypalURL= document.getElementById("donate_link_input").value;
        //if they did not put in https we put it in
        if(startsWith(paypalURL,"paypal.me")){
            paypalURL="https://"+paypalURL;
        }else if(!startsWith(paypalURL,"https:") && validateEmail(paypalURL)){

        
            //we are pry a paypal email
            paypalURL = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business="+paypalURL+"&currency_code=USD&source=url";
        
        };



        var formData = new FormData();
        formData.append('update', 'profile_basic');
        formData.append('fun_name',document.getElementById("fun_name_input").value);
        formData.append('real_name',document.getElementById("real_name_input").value);
        formData.append('twitter_name',document.getElementById("twitter_name_input").value);
        formData.append('location',document.getElementById("location_input").value);
        formData.append('donate_link',paypalURL);
        formData.append('how_to_help',document.getElementById("how_to_help_input").value);

        makeRequest('POST', prod_api+"/profile.php",formData).then(function(profile_slug){
            window.location.href = "/profile/"+profile_slug;
        })


});
function showDailyActivityPrivacy(p){
        if(!p){
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>daily activity is public: <a href='#' id='grepperSetDailyActivityRankPrivateYes'>set private </a>";
            document.getElementById("daily_activity_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("grepperSetDailyActivityRankPrivateYes").addEventListener("click", function(event) {
                grepperSetDailyActivityRankPrivate(1);
            });
        }else{
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>daily activity is private: <a href='#' id='grepperSetDailyActivityRankPrivateNo'>set public </a>";
            document.getElementById("daily_activity_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("grepperSetDailyActivityRankPrivateNo").addEventListener("click", function(event) {
                grepperSetDailyActivityRankPrivate(0);
            });
      }

}

function showActivityEnabled(p){
   if(!p){
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>coding activity is disabled: <a href='#' id='grepperSetActivityEnabled'>enable coding activity</a>";
            document.getElementById("activity_enabled_holder").innerHTML=rankPrivacyHTML;
            document.getElementById("coding_activity_is_enabled_holder").style.display="none";
            document.getElementById("grepperSetActivityEnabled").addEventListener("click", function(event) {
                grepperSetActivityEnabled(1);
            });

        }else{
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>coding activity is enabled: <a href='#' id='grepperSetActivityDisabled'>disable coding activity</a>";

            document.getElementById("activity_enabled_holder").innerHTML=rankPrivacyHTML;

            document.getElementById("coding_activity_is_enabled_holder").style.display="block";
            document.getElementById("grepperSetActivityDisabled").addEventListener("click", function(event) {
                grepperSetActivityEnabled(0);
            });
      }
}
function showExpertisePrivacy(p){

    if(!document.getElementById("activity_expertise_privacy")){
        return;
    }

    //activity_privacy
        if(!p){

            console.log("expertise is public");
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>coding expertise is public: <a href='#' id='grepperSetExpertiseRankPrivateYes'>set private </a>";
            document.getElementById("activity_expertise_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("is_expertise_private_holder").style.display="block";

            document.getElementById("grepperSetExpertiseRankPrivateYes").addEventListener("click", function(event) {
                grepperSetExpertiseRankPrivate(1);
            });
        }else{
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>coding expertise is private: <a href='#' id='grepperSetExpertiseRankPrivateNo'>set public </a>";
            document.getElementById("activity_expertise_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("is_expertise_private_holder").style.display="none";
            document.getElementById("grepperSetExpertiseRankPrivateNo").addEventListener("click", function(event) {
                grepperSetExpertiseRankPrivate(0);
            });
      }

}


function showActivityPrivacy(p){
    //activity_privacy
        if(!p){
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>activity overview is public: <a href='#' id='grepperSetActivityRankPrivateYes'>set private </a>";
            document.getElementById("activity_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("grepperSetActivityRankPrivateYes").addEventListener("click", function(event) {
                grepperSetActivityRankPrivate(1);
            });
        }else{
            var rankPrivacyHTML="<i class='icon hand point left outline'></i>activity overview is private: <a href='#' id='grepperSetActivityRankPrivateNo'>set public </a>";
            document.getElementById("activity_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("grepperSetActivityRankPrivateNo").addEventListener("click", function(event) {
                grepperSetActivityRankPrivate(0);
            });
      }

}

function showRankPrivacy(p){
        if(!p){
            var rankPrivacyHTML="<i class='icon hand pointer outline'></i>belt is public: <a href='#' id='grepperSetRankPrivateYes'>set private </a>";
            document.getElementById("rank_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("grepperSetRankPrivateYes").addEventListener("click", function(event) {
                grepperSetRankPrivate(1);
            });
        }else{
            var rankPrivacyHTML="<i class='icon hand pointer outline'></i>belt is private: <a href='#' id='grepperSetRankPrivateNo'>set public </a>";
            document.getElementById("rank_privacy").innerHTML=rankPrivacyHTML;
            document.getElementById("grepperSetRankPrivateNo").addEventListener("click", function(event) {
                grepperSetRankPrivate(0);
            });
      }

}


function getPixels(day){
var langs=[
        "abap",
        "actionscript",
        "assembly",
        "basic",
        "c",
        "clojure",
        "cobol",
        "cpp",
        "csharp",
        "css",
        "dart",
        "delphi",
        "elixir",
        "erlang",
        "fortran",
        "fsharp",
        "go",
        "groovy",
        "haskell",
        "html",
        "java",
        "javascript",
        "julia",
        "kotlin",
        "language",
        "lisp",
        "lua",
        "matlab",
        "objectivec",
        "pascal",
        "perl",
        "php",
        "postscript",
        "prolog",
        "python",
        "r",
        "ruby",
        "rust",
        "scala",
        "scheme",
        "shell",
        "smalltalk",
        "sql",
        "swift",
        "term",
        "typescript",
        "vb",
        "webassembly",
        "whatever"
    ];

    //delete day["term"];
    //delete day["user_id"];
    //delete day[""];
    var scores=[];
	var scoresSum=0;
    for(var i =0;i< langs.length;i++){
        if(parseInt(day[langs[i]]) > 0){
            scores.push([langs[i],parseInt(day[langs[i]])]);
			scoresSum+=parseInt(day[langs[i]]);
        }
    }
    scores.sort(function(a, b) {
        return b[1] - a[1];
    });


	if(!scores){
		return '';
	}
	
	var scoresP=[];

	var html="";
    var lCount= scores.length

     for(var i =0;i<scores.length;i++){
            if(scoresSum > 12){
                scores[i].push(Math.floor((scores[i][1]/scoresSum) * 144));
            }else{
                //each score is 1 row
                scores[i].push(scores[i][1] * 12);
            }
     }
    for(var i = 0;i<scores.length;i++){
        for (var j=0;j<scores[i][2];j++) {
            html+="<div class='l_pixel pixel_lang_"+scores[i][0]+"'></div>";
        }
    }

    //if sum is less that 5
    /*
    if(scoresSum < 5){
        for(var i =0;i<scores.length;i++){
            scores[i].push(1);
        }
     
    }else if(lCount <= 4){
        //sum is greater than 5 (we always want to be full)
        //and we don't have more than 4 langs (just need to figure out how to split it up)
        if(lCount == 2){
		    var languageNumber1 =scores[0][1]/scoresSum;
            if(languageNumber1 > .75){
                   scores[0].push(3); 
                   scores[1].push(1); 
            }else{
                   scores[0].push(2); 
                   scores[1].push(2); 
            }
        }else if(lCount == 3){
           scores[0].push(2); 
           scores[1].push(1); 
           scores[2].push(1); 
        }else if(lCount == 4){
           scores[0].push(1); 
           scores[1].push(1); 
           scores[2].push(1); 
           scores[3].push(1); 
        }

    }else if (lCount > 4){
        //for now just top 4 get in
           scores[0].push(1); 
           scores[1].push(1); 
           scores[2].push(1); 
           scores[3].push(1); 
    }

    for(var i = 0;i<scores.length;i++){
        for (var j=0;j<scores[i][2];j++) {
            html+="<div class='l_pixel pixel_lang_"+scores[i][0]+"'></div>";
        }
    }
    */

    
	return html;

}

function getUserActivityStats(p){
    makeRequest('GET',"/api/get_user_activity_stats.php?user_id="+user_id).then(function(d){
            var uhca= document.getElementById("user_historical_coding_activity");
            var uhcatl= document.getElementById("user_historical_coding_activity_top_languages");
            var uhcatf= document.getElementById("user_historical_coding_activity_top_frameworks");
            var stats= JSON.parse(d);
            var html="";
            for(var i =0;i<stats.a.length;i++){
                if(i%7 == 0){
                    if(i != 0 ){
                        html+='</div>';
                    }
                    html+="<div class='activity_week_box'>";
                }

            var t = stats.a[i].ymd.split(/[- :]/);
            

            var d = new Date(t[0], t[1]-1, t[2]);

            var formattedDate=dateToNiceDayStringDay(d);
                html+="<div onclick=\"getUserDailyCodingActivity('"+stats.a[i].ymd+"')\" data-tooltip='"+formattedDate+"'  data-position='top center' title='"+formattedDate+"' class='activity_day_box'>"+getPixels(stats.a[i])+"</div>";
            }
            uhca.innerHTML=html;
            var tophtml='';
            for(var i =0;i<stats.s.length;i++){

                if(i > 9){ break; }
                if(stats.s[i][1] < 1){
                    break;
                }
                tophtml+="<div class='user_top_language_holder'><div class='activity_day_box pixel_lang_"+stats.s[i][0]+"'></div> "+stats.s[i][0]+"</div>";
            }

            uhcatl.innerHTML=tophtml;

            var tophtml2='';
            var topFrameworks=stats.f;
            for (var i =0;i<topFrameworks.length;i++){
                if(i>9){
                    break;
                }
                tophtml2+="<div class='user_top_frameworks_holder'> <img class='framework_icon_small' src='/images/framework_icons/"+topFrameworks[i][2]+".png'> <span>"+topFrameworks[i][0]+"</span></div>";
            }

            uhcatf.innerHTML=tophtml2;


    });
}

var userDailyActivity;
function displayUserDailyActivity(activity,date_obj){

        userDailyActivity=activity;
        var html="";
        document.getElementById("user_coding_activity_header_date").innerHTML= dateToNiceDayStringDay(date_obj);


    //Viewed | Upvoted | Answered
    for(var i =0;i<activity.length;i++){

   var t = activity[i].created_at.split(/[- :]/);
   var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
   var formattedDate=dateToNiceDayStringDay(d);
   var formattedDate2=dateToNiceDayStringTimeOnly(d);


        var action = "Viewed ";
        if(activity[i].upvote){
            action = "Upvoted ";
        }else if(activity[i].is_my_answer){
            action = "Answered ";
        }



        html+="<div class='user_coding_activity'>" ;
        html+="<div class='user_coding_activity_text' onclick='showAnswer2(this,"+i+")'>";
        html+=action+"<a href='profile.php?id="+activity[i].answer_user_id+"'>"+htmlEntities(activity[i].answer_fun_name)+"'s</a> code answer to â€œ"+activity[i].answer_title+"â€<i class='answer_more_icon icon angle right'></i>";
        html+="</div>";
        html+="<div class='user_coding_activity_time'>"+formattedDate2+"</div>";
            
        html+="<div style='clear:both'></div>";
        html+="</div>";
    }
    document.getElementById("user_historical_coding_activity_day").innerHTML=html;
}

function getUserDailyCodingActivity(date_str){

if (typeof date_str !== 'undefined'){
    var t = date_str.split(/[- :]/);
    var date_ob = new Date(t[0], t[1]-1, t[2]);

}else{
    date_ob = new Date();
}

var date = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var year = date_ob.getFullYear();

var day = year + "-" + month + "-" + date;

makeRequest('GET',"/api/get_user_daily_coding_activity.php?day="+day+"&user_id="+user_id).then(function(d){

    var a= JSON.parse(d);
    displayUserDailyActivity(a.a,date_ob);
});

}




//just always get these an only show if we have permissions
//if(user_id == localStorage.getItem('user_id')){
if(document.getElementById("coding_activity_box")){
    getUserActivityStats();
    getUserDailyCodingActivity();
}
//}



function follow(el,follow_user_id){
    var follow = (el.getAttribute("is_following") == 1) ? 0 : 1;
    makeRequest('GET',prod_api+"/follow.php?follow_user_id="+follow_user_id+"&follow="+follow).then(function(d){
        if(follow){
            el.setAttribute("is_following",1);
            el.textContent="Unfollow";
        }else{
            el.setAttribute("is_following",0);
            el.textContent="Follow";
        }

    });
}

function grepperSetDailyActivityRankPrivate(p){
    makeRequest('GET',prod_api+"/update_rank_privacy.php?is_daily_activity_private="+p).then(function(d){
        showDailyActivityPrivacy(p);
    });
}

function grepperSetActivityEnabled(p){
    makeRequest('GET',"/api/update_rank_privacy.php?enable_coding_activity="+p).then(function(d){
        showActivityEnabled(p);
    });
}

function grepperSetActivityRankPrivate(p){
    makeRequest('GET',prod_api+"/update_rank_privacy.php?is_activity_private="+p).then(function(d){
        showActivityPrivacy(p);
    });
}

function grepperSetExpertiseRankPrivate(p){
    makeRequest('GET',prod_api+"/update_rank_privacy.php?is_expertise_private="+p).then(function(d){
        showExpertisePrivacy(p);
    });
}

function grepperSetRankPrivate(p){
    makeRequest('GET',prod_api+"/update_rank_privacy.php?is_rank_private="+p).then(function(d){
        showRankPrivacy(p);
    });
}

