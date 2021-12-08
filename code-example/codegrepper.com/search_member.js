
function memberSearch() {
  this.endpoint="https://www.codegrepper.com/api";
  this.inputEl=document.getElementById("members");
  this.autocompleteEl=document.getElementById("members_list_group");
  this.membersListEl=document.getElementById("members_list");
}

memberSearch.prototype.init=function(){
    var that=this;
//  document.addEventListener("click", function(e){
//      that.autocompleteEl.style.display="none";
//  });

  document.getElementById("complete_setup").addEventListener("click", function(e){
      that.complete_setup(this);
  });

  this.inputEl.addEventListener("keyup", function(e){
    if (e.keyCode === 13) {
    var lis = that.autocompleteEl.getElementsByTagName('li');
       for(var i=0;i<lis.length;i++){
           if(lis[i].classList.contains('active')){
                that.addMemberToList(lis[i]);
                continue;
           }
       }
    }else if(e.keyCode == 37 || e.keyCode == 38 ){
        that.keyUp();
    }else if(e.keyCode == 39 || e.keyCode == 40 ){
        that.keyDown();
    }else if(e.keyCode == 8 ){
        //backspacek
        if(!this.value){
            //remove last memeber
        var lis = that.membersListEl.getElementsByClassName('close');
            that.removeMemberFromList(lis[lis.length-1]);
        }

    }else{
        that.auto_complete(this.value);

    }
});
}

memberSearch.prototype.auto_complete =function(search){

    var team_id = getParameterByName("id"); 
    if(search.length < 3){
        this.autocompleteEl.style.display="none";
        return;
    }
    makeRequest('GET', this.endpoint+"/autocomplete_users_search.php?team_id="+team_id+"&q="+search).then(function(data){
            var results=JSON.parse(data);
            this.showAutoCompleteResults(results);
    }.bind(this));
}


memberSearch.prototype.removeMemberFromList=function(member){

    member.parentNode.parentNode.removeChild(member.parentNode);
}

memberSearch.prototype.addMemberToList=function(member){

    this.inputEl.value="";
    this.autocompleteEl.style.display="none";

    var that=this;
    var memberListEl=document.createElement('a')
        memberListEl.classList.add("btn");
        memberListEl.classList.add("btn-primary");

        memberListEl.setAttribute("user_id",member.getAttribute("user_id"));
        memberListEl.setAttribute("is_email",member.getAttribute("is_email"));
        memberListEl.setAttribute("email_address",member.getAttribute("email_address"));

        
    var img=document.createElement('img')
        img.src='/profile_images/50_50/'+member.getAttribute("profile_image");
        img.classList.add('mr-3');
        memberListEl.appendChild(img);

    var s=document.createElement('strong')
        s.innerHTML=member.getAttribute("fun_name")+"";
        //s.classList.add('ml-3');
        //s.classList.add('mr-1');
        memberListEl.appendChild(s);
    var br=document.createElement('br')
        memberListEl.appendChild(br);

    var ss=document.createElement('span')
        ss.classList.add("real_name");
        ss.innerHTML= (member.getAttribute("real_name")) ? member.getAttribute("real_name") : '&nbsp;';
        //ss.classList.add('ml-3');
        //ss.classList.add('mr-1');
        memberListEl.appendChild(ss);

    var closeButtonH=document.createElement("button");
        closeButtonH.classList.add("close");
        closeButtonH.classList.add("ml-4");
        closeButtonH.setAttribute("aria-label","Close");

      closeButtonH.addEventListener('click',function(event){                          
          that.removeMemberFromList(this);
      });


    var closeButton=document.createElement("span");
        closeButton.setAttribute("aria-hidden",true);
        closeButton.classList.add("close_button_top_right");
        closeButton.innerHTML="&times;";

        closeButtonH.appendChild(closeButton);
        memberListEl.appendChild(closeButtonH);

    //this.membersListEl.appendChild(memberListEl);
    this.membersListEl.insertBefore(memberListEl,this.inputEl);
    //parentNode.insertBefore(newNode, referenceNode)

}
memberSearch.prototype.showAutoCompleteResults=function(results){
    var ac=this.autocompleteEl;
    ac.style.display="block";
    ac.innerHTML="";

    var that =this;
   for(var i=0;i<results.length;i++){
        var memberListElement = document.createElement('li');

            if(!results[i].profile_image){ results[i].profile_image="default_profile.png"; }
            if(!results[i].real_name){ results[i].real_name=""; }

              memberListElement.classList.add("list-group-item");
              memberListElement.classList.add("contsearch");
              memberListElement.setAttribute("fun_name",results[i].fun_name);
              memberListElement.setAttribute("is_email",((results[i].is_email) ? true:""));
              memberListElement.setAttribute("email_address",results[i].email);
              memberListElement.setAttribute("user_id",results[i].id);
              memberListElement.setAttribute("profile_image",results[i].profile_image);
              memberListElement.setAttribute("real_name",results[i].real_name);

           if(!results[i].is_team_member){
                  memberListElement.addEventListener('click',function(event){                          
                      that.addMemberToList(this);
                 }); 
            }else{
              memberListElement.classList.add("list-group-item-secondary");
            }

                          
            if(results[i].is_email){
                var memberInnerHTML = '<i class="icon mail m-3"></i>';
                    results[i].real_name = "invite to your team";

            }else{
                var memberInnerHTML = '<img  class="mr-3" src="/profile_images/50_50/'+results[i].profile_image+'">'
            }

                memberInnerHTML +='<strong class="mr-2">'+results[i].fun_name+'</strong>';
                memberInnerHTML +='<span>'+results[i].real_name+'</span>';

           if(results[i].is_team_member){
                memberInnerHTML +=' (Already a team member) ';
           }else{
                memberInnerHTML +='<i style="position:absolute;right:15px;font-size:30px;color:#ccc;">&#43;</i>';
           }
            
            memberListElement.innerHTML=memberInnerHTML;
        
        this.autocompleteEl.appendChild(memberListElement);
    }

}

memberSearch.prototype.keyUp=function(){
    var s=this.inputEl;
    var lis =this.autocompleteEl.getElementsByTagName('li');
    var found=false;
   for(var i=0;i<lis.length;i++){
       if(lis[i].classList.contains('active')){
           lis[i].classList.remove("active");
           if(i){
            lis[i-1].classList.add("active");
            //s.value=lis[i-1].textContent;
            return;
           }else{
            //s.value=this.acSearchStartValue;
            return;
           }
       }
   }
   //this.acSearchStartValue=s.value;
   //s.value=lis[lis.length-1].textContent;
   lis[lis.length-1].classList.add("active");
}

memberSearch.prototype.keyDown=function(){
    var s=this.inputEl;
    var lis =this.autocompleteEl.getElementsByTagName('li');
    var found=false;
   for(var i=0;i<lis.length;i++){
       if(lis[i].classList.contains('active')){
           lis[i].classList.remove("active");
           if(i<(lis.length-1)){
            lis[i+1].classList.add("active");
            //s.value=lis[i+1].textContent;
            return;
           }else{
            //s.value=this.acSearchStartValue;
            return;
           }
       }
   }
   //this.acSearchStartValue=s.value;

   //s.value=lis[0].textContent;
   lis[0].classList.add("active");
}

memberSearch.prototype.complete_setup=function(el){

    var lis = this.membersListEl.getElementsByTagName('a');
    var members=[];
    var team_id = getParameterByName("id"); 

    for(var i=0;i<lis.length;i++){
       var member={ };
       member.team_id=team_id;
       if(lis[i].getAttribute("is_email")){
            member.is_email=true;
            member.email= lis[i].getAttribute("email_address");
       }else{
            member.user_id=lis[i].getAttribute("user_id");
       }
        members.push(member);
   }

    makeRequest('POST', prod_api+"/add_team_members.php",JSON.stringify(members)).then(function(){
        if(el && el.getAttribute("jump-to-team")){
            window.location="/app/team.php?id="+team_id;
        }else{
            for(var i=0;i<lis.length;i++){
                lis[i].parentNode.removeChild(lis[i]);
            }

            document.getElementById('invite_sent_alert').style.display="block";
            setTimeout(function(){
                document.getElementById('invite_sent_alert').style.display="none";
            }, 1000);
        }
    });
}


var gs=new memberSearch();
gs.init();
