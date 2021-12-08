//var prod_api = "https://www.codegrepper.com/api";
var currentPage=1;
var langs=[];
var sort_by = "id_desc";
var currentEditingAnswer=false; 

function addTerm(){
	var term =  document.getElementById("new_answer_search_term").value;
	if(term.length < 5){
		alert("Oops! That is little too short, terms must be at least 5 characters long");
		return;
	}
	 var data={};
		data.id=currentEditingAnswer.id;
		data.term= term; 
	makeRequest('POST', "/api/save_answer_term.php",JSON.stringify(data)).then(function(datar){
	   if(datar=="max_reached"){
			alert("Oops! Max terms reached, no more than 10 search terms per answer can be used.");
			return;
		}

		//then reload
		showAnswerTermsEditableBox(currentEditingAnswer);
	}.bind(this));
}


function showAnswerTermsEditableBox(answer){
currentEditingAnswer=answer;

makeRequest('GET',"/api/get_answer_terms.php?answer_id="+answer.id).then(function(data){

	  document.getElementById("answer_search_terms").innerHTML="";
	  let terms_data=JSON.parse(data);
	  let terms=terms_data.terms;
		for(let i=0;i<terms.length;i++){

		let listOuter = document.createElement("list");
			listOuter.classList.add('list-group-item');
			listOuter.classList.add('list-group-item-action');
 
	let answerTermDefaultHolder = document.createElement("div");
		answerTermDefaultHolder.classList.add('answer_term_default_holder');
		//answerTermDefaultHolder.textContent=terms[i].term;
		listOuter.appendChild(answerTermDefaultHolder);

		if(terms[i].is_primary_answer_term){
			let primaryBadge=document.createElement("span");
				primaryBadge.classList.add("badge");
				primaryBadge.classList.add("badge-pill");
				primaryBadge.classList.add("badge-primary");
				primaryBadge.classList.add("badge-primary-answer");
				primaryBadge.textContent="Primary Term";
				answerTermDefaultHolder.appendChild(primaryBadge);
		}

		let termSpan=document.createElement("span");
			termSpan.textContent=terms[i].term;
			answerTermDefaultHolder.appendChild(termSpan);

		  
	  let btnGroup = document.createElement("div");
		  btnGroup.classList.add('btn-group');
		  btnGroup.classList.add('float-right');
		  answerTermDefaultHolder.appendChild(btnGroup);

	  let xBtn = document.createElement("button");
		  xBtn.classList.add('btn');
		  xBtn.classList.add('btn-danger');
		  xBtn.classList.add('btn-sm');
		  xBtn.title="Delete";
		  xBtn.setAttribute("data-placement","top");
		  xBtn.setAttribute("data-toggle","tooltip");
		  xBtn.setAttribute("search_id",terms[i].id);

	  let xBtnIcon = document.createElement("i");
		  xBtnIcon.classList.add('icon');
		  xBtnIcon.classList.add('x');

	 if(!terms[i].is_primary_answer_term){
		  btnGroup.appendChild(xBtn);
		  xBtn.appendChild(xBtnIcon);
	 }


	  let eBtn = document.createElement("button");
		  eBtn.classList.add('btn');
		  eBtn.classList.add('btn-secondary');
		  eBtn.classList.add('btn-sm');
		  eBtn.title="Edit";
		  eBtn.setAttribute("data-placement","top");
		

		  btnGroup.appendChild(eBtn);

	  let eBtnIcon = document.createElement("i");
		  eBtnIcon.classList.add('icon');
		  eBtnIcon.classList.add('edit');
	  

		  eBtn.appendChild(eBtnIcon);

	let answerTermEditHolder = document.createElement("div");
		answerTermEditHolder.classList.add('answer_term_edit_holder');
		//answerTermEditHolder.textContent=terms[i].term;
		listOuter.appendChild(answerTermEditHolder);
	 

	let inputGroup  = document.createElement("div");
		inputGroup.classList.add('input-group');
		answerTermEditHolder.appendChild(inputGroup);

	let answerTitleInput  = document.createElement("input");
		answerTitleInput.value=terms[i].term;
		answerTitleInput.setAttribute("type","text");
		answerTitleInput.style.width="88%";
		inputGroup.appendChild(answerTitleInput);

	let inputGroupAppend  = document.createElement("div");
		inputGroupAppend.classList.add('input-group-append');
		inputGroup.appendChild(inputGroupAppend);


	let saveEditButton  = document.createElement("button");
		saveEditButton.classList.add('btn');
		saveEditButton.setAttribute("search_id",terms[i].id);
		saveEditButton.classList.add('btn-primary');
		inputGroupAppend.appendChild(saveEditButton);

		saveEditButtonIcon=document.createElement("i");
		saveEditButtonIcon.classList.add('icon');
		saveEditButtonIcon.classList.add('check');
		saveEditButtonIcon.setAttribute("data-placement","top");
		saveEditButtonIcon.setAttribute("data-toggle","tooltip");
		saveEditButtonIcon.title="Save";
		saveEditButton.appendChild(saveEditButtonIcon);

			//setup the listeners
		  eBtn.addEventListener("click",function(){
			answerTermEditHolder.style.display="block";
			answerTermDefaultHolder.style.display="none";
		  });


		answerTitleInput.addEventListener("keydown", function(event) {
			if (event.key === "Enter") {
				var data={};
					data.id=saveEditButton.getAttribute("search_id");
					data.term=answerTitleInput.value;
				makeRequest('POST', "/api/update_answer_term.php",JSON.stringify(data)).then(function(datar){
					//then reload
					showAnswerTermsEditableBox(answer);
				}.bind(this));
				  
			}
		});

		  saveEditButton.addEventListener("click",function(){
			 var data={};
				data.id=this.getAttribute("search_id");
				data.term=answerTitleInput.value;
			makeRequest('POST', "/api/update_answer_term.php",JSON.stringify(data)).then(function(datar){
				//then reload
				showAnswerTermsEditableBox(answer);
			}.bind(this));
		  });

		 xBtn.addEventListener("click",function(){
			var r = confirm("Are you sure you want to delete this term?");
			if (r == true) {
					 var data={};
					data.id=this.getAttribute("search_id");
				makeRequest('POST', "/api/delete_answer_term.php",JSON.stringify(data)).then(function(datar){
					showAnswerTermsEditableBox(answer);
				}.bind(this));
			}
		 });


		document.getElementById("answer_search_terms").appendChild(listOuter);
		}
	
});


	$("#addAnswerTermsModal").modal();
}

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

	var table = document.getElementById("my_answers_holder");
		table.innerHTML="";

	//document.getElementById("order_by").value=sort_by;

	var url=prod_api+"/get_all_users_answers2.php?";
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

	if(document.getElementById("include_upvotes").checked){
		url+="&include_upvotes=1";
	}

	 makeRequest('GET',url).then(function(data){
	  var answers_all=JSON.parse(data);
	  var answers=answers_all.answers;

		var totalPending=0;
		var totalApproved=0;
		var totalPaid=0;
		var codeMirrorAnswers=[];
		for(let i=0;i<answers.length;i++){
			  //var row = table.insertRow(i+1);
			  //var cell2 = row.insertCell(0);
			  //var cell3 = row.insertCell(1);
			  //table.innerHTML=answers[i].term;

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

	 var grepperOptionsHolderTitle =  document.createElement('div');
		 grepperOptionsHolderTitle.classList.add("grepper_options_holder_title_editable");
		 grepperOptionsHolderTitle.textContent=answers[i].term;
 
	 var grepperOptionsHolderSpan =  document.createElement('span');
		 grepperOptionsHolderSpan.classList.add("commando_answers_options_nickname");
		 grepperOptionsHolderSpan.textContent= answers[i].created_at;

	 var grepperOptionsHolderSpan2 =  document.createElement('span');
		 grepperOptionsHolderSpan2.classList.add("commando_answers_options_delete");
		 grepperOptionsHolderSpan2.textContent= "Delete";

		 if(answers[i].is_others_answer){
			grepperOptionsHolderSpan2.style.display = "none";
		 }
		 

		 grepperOptionsHolderSpan2.addEventListener('click',function(){
			deleteAnswer(answers[i].id);
		 }.bind(this));

		 grepperOptionsHolderTitle.addEventListener('click',function(){
			showAnswerTermsEditableBox(answers[i]);
		 }.bind(this));

		grepperOptionsHolder.appendChild(grepperOptionsHolderTitle);
		grepperOptionsHolder.appendChild(grepperOptionsHolderSpan);
		grepperOptionsHolder.appendChild(grepperOptionsHolderSpan2);
		grepperOptionsHolder.appendChild(mySelect);

		table.appendChild(grepperOptionsHolder);
		table.appendChild(answerTextarea);


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
		if(answers[i].video_name){
				html+="<a target='_blank' href='https://www.google.com/search?q="+answers[i].term+"'>Edit Video<i class='icon angle right'></i></a>";
				html+="<video controls style='width:590px;left:-10px;position:relative;border:1px solid #777;'>";
				html+='<source src="/video_uploads/'+answers[i].video_name+'.mp4" type="video/mp4">';
				html+='<source src="/video_uploads/'+answers[i].video_name+'.webm" type="video/webm">';
				html+="</video>";
		}

		
			 var saveButton = document.createElement('div');
				 saveButton.setAttribute("id","commando_save_answer_holder");
				 saveButton.innerHTML =html;
				 saveButton.innerHTML +='<button class="btn btn-light" id="commando_save_answer">Save Edits</button>';
				 table.appendChild(saveButton);
		 
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
		var dialog = document.createElement("div");
		 dialog.setAttribute("id","grepper_web_flash_message");
		 dialog.textContent="Answer Saved!";
			 document.body.appendChild(dialog);
			  setTimeout(function(){
				dialog.parentNode.removeChild(dialog);
			  },2000);
		}.bind(this));
	}.bind(this));

	//codeMirrorAnswers[i].setSize(600,null);

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
	var start = 1;
	var pagesEnd =  pages;


	if(pages > 9){
		if(currentPage > 5){
			start = currentPage-5; 
			if(pagesEnd > currentPage+5){
				pagesEnd = currentPage+4;
			}
		}else {
			pagesEnd=10;
		}


	}
	if(currentPage > 1){
		html+="<li class='page-item' ";   
		html+=" onclick='goToPage("+(currentPage-1)+")'> <a class='page-link'>« Previous</a></li>";
	}
	
	for(var i=start;i<=pagesEnd;i++){
		html+="<li ";
		if(currentPage === i){
			html+=" class='page-item active' ";   
		}else{
			html+=" class='page-item' ";   
		}
		html+=" onclick='goToPage("+i+")'> <a class='page-link'>"+i+"</a></li>";

	}

	if(currentPage <= (pages-1)){
		html+="<li class='page-item' ";   
		html+=" onclick='goToPage("+(currentPage+1)+")'> <a class='page-link'>Next »</a></li>";
	}

	p[t].innerHTML=html;


	}
	
}


var isUserTypingTimer;   
var doneTypingInterval = 200; 

function doneTyping () {
	loadBounties();
}

document.getElementById("answer_search").addEventListener('keyup', function(event){
	 abortRequests();
	 clearTimeout(isUserTypingTimer);
	 isUserTypingTimer = setTimeout(doneTyping, doneTypingInterval);
});
document.getElementById("answer_search").addEventListener('keydown', function(event){
	clearTimeout(isUserTypingTimer);
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
	makeRequest('GET',"/api/get_user_code_languages_used_only.php").then(function(d){
		langs= JSON.parse(d);
		var html='<div id="filters" value="filters"> <div class="side_header">My Languages</div>';

		for (var i = 0; i < langs.ucl.length; i++) {
			if(langs.ucl[i].enabled){
			html+='<li><label><input onchange="abortRequests();loadBounties();" type="checkbox" name="language_select" value="'+langs.ucl[i].lkey+'"><span class="lang_name">'+langs.ucl[i].name+'</span><span class="language_count">'+langs.ucl[i].lcount+'</span></label></li>';
			}
		}
		/*
		html+='<div class="side_header">All Languages</div>';
		for (var i = 0; i < langs.ucl.length; i++) {
			if(!langs.ucl[i].enabled){
			html+='<li><label><input onchange="abortRequests();loadBounties();" type="checkbox" name="language_select" value="'+langs.ucl[i].lkey+'">'+langs.ucl[i].name+'</label></li>';
			}
		}
		*/

		document.getElementById("languages_select_mine").innerHTML=html;

		loadBounties();
	});

	//add keydown listern
	var newTermInput=document.getElementById("new_answer_search_term");
	if(newTermInput){
		newTermInput.addEventListener("keydown", function(event) {
			if (event.key === "Enter") {
				addTerm();
			}
		 });
	}
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






