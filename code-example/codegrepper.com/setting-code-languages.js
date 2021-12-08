makeRequest('GET',prod_api+"/get_user_code_languages.php").then(function(d){
    var langs= JSON.parse(d);
    var html='<div id="filters" value="filters"> <div class="side_header">Language</div>';
    for (var i = 0; i < langs.ucl.length; i++) {
        var checked=(langs.ucl[i].enabled) ?  ' checked = "checked" ' :'';
        html+='<li><label><input class="set_code_language_name" onchange="setCodeLanguage(this)" type="checkbox" name="language_select" '+checked+' value="'+langs.ucl[i].lkey+'">'+langs.ucl[i].name+'</label></li>';
    }
    document.getElementById("my_languages_holder").innerHTML=html;

});

function setCodeLanguage(element,user_id){

	//do some action if it is checked
        var isChecked=(element.checked) ? 1 : 0;
      makeRequest('GET', prod_api+"/update_my_code_languages.php?l="+element.value+"&enabled="+isChecked).then(function(data){
    });


var els = document.getElementsByClassName("set_code_language_name");
var allLangs=[];
for(var i = 0; i < els.length; i++){
    allLangs.push({"lkey":els[i].value,"isChecked": (els[i].checked) ? 1 : 0});
}
   var event = new CustomEvent("grepper_user_languages_updated", { "detail": allLangs});
      document.dispatchEvent(event);
}