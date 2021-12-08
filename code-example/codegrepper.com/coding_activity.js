    makeRequest('GET',"/api/get_user_linkedin_data.php?user_id="+user_id).then(function(d){
        var stats= JSON.parse(d);
        drawPiechart(stats).then(function(canvas){
                var dataURL = canvas.toDataURL();
                var formData = new FormData();
                    formData.append('data_url',dataURL);
                    //makeRequest('POST',"/api/save_coding_activity_image.php",formData);
            //document.getElementById("og_image").setAttribute("content",dataURL);
        });
    });

    var canvasSizeWidth =757;
    var canvasSizeHeight=600;
    var imageSize = 220;
    var bubbleX = false;
    var bubbleY = false;
    var bubbleTextWidth= false;
    var bubbleText=false;


function drawPiechart(r){
    return new Promise(function(resolve, reject) {
      var user = r.user;

      if(!user.profile_image){
           user.profile_image="/app/img/default_profile.png";
      }else{
           user.profile_image='/profile_images/'+user.profile_image;
      }

    //use linkedin by default
   // if(user.profile_image_linkedin){
   //      user.profile_image=user.profile_image_linkedin;
   // }

 // var short_name="";
 // if(user.real_name){
 //     short_name = user.real_name.split(" ")[0];
 // }else{
 //     short_name = user.fun_name.split(" ")[0];
 // }

 // user.short_name=short_name;

  var short_name=user.short_name;

  var canvas = document.getElementById("profileChart");
  // Initialize the GL context
  var ctx = canvas.getContext("2d");
      //ctx.globalAlpha=0.70;


  var radiusInner=230;
  var radiusOuter=300;

  var data=[]; 
  var labels=[];
  var labelskeys=[];
  var labelsText=[];

    var lsum=0;
    for(var i=0;i<r.s.length;i++){
        var v=r.s[i][1];
        //if(lsum==0||(v/lsum) > .01 ){
            lsum+=v
        //}
    }

    for(var i=0;i<r.s.length;i++){
        //if((r.s[i][1])/lsum > .01){
            data.push(r.s[i][1]/lsum);
            labels.push(r.s[i][2]);
            labelskeys.push(r.s[i][0]);

            var text=Math.round((r.s[i][1]/lsum)*100)+"% of "+short_name+"'s time is \nspent programming in "+ r.s[i][2]+".";
            var pScore = Math.round(r.s[i][3]*100);
            if(pScore > 50){
                text+="\n"+short_name+" ranks in the top "+pScore+" percentile\n for "+ r.s[i][2]+" expertise.";
            }
            labelsText.push(text);
        //}
    }

  var data2 =[];
  var labels2=[]
  var labels2keys =[];
  var labels2Text=[];
  var labels2Images=[];

var lsum=0;
for(var i=0;i<r.f.length;i++){
    var v=r.f[i][1];
   // if(lsum==0||(v/lsum) > .01 ){
        lsum+=v
   // }
}

for(var i=0;i<r.f.length;i++){
    //if((r.f[i][1])/lsum > .01){
        data2.push(r.f[i][1]/lsum);
        labels2.push(r.f[i][0]);
        labels2keys.push(r.f[i][2]);

    var labelImageImg = new Image();
        labelImageImg.src = '/images/framework_icons/'+r.f[i][2]+".png";
        labels2Images.push(labelImageImg);

        var text=Math.round((r.f[i][1]/lsum)*100)+"% of "+short_name+"'s time is \nspent programming in "+ r.f[i][0]+".";
        var pScore = Math.round(r.f[i][3]*100);
        if(pScore > 50){
            text+="\n"+short_name+" ranks in the top "+pScore+" percentile\n for "+ r.f[i][0]+" expertise.";
        }
        labels2Text.push(text);
    //}
}


  // Only continue if WebGL is available and working
      if (ctx === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      }

    var profileImage = new Image();
        profileImage.src = user.profile_image;

    var grepperG = new Image();
        grepperG.src = '/app/img/icon_tall.png';
          
        profileImage.onload = function(){
           drawProfileImage(profileImage,ctx,user,grepperG);
           //i think generally this happens last ( but could break w/out profile iamge)
           resolve(canvas);
        }

        drawDonut(data2,ctx,(radiusInner),radiusOuter,labels2,labels2keys,labels2Text,labels2Images); 
        drawDonut(data,ctx,(imageSize/2),radiusInner,labels,labelskeys,labelsText,false); 

          var cw=canvas.width;
          var ch=canvas.height;
          function reOffset(){
              var BB=canvas.getBoundingClientRect();
              offsetX=BB.left;
              offsetY=BB.top;
          }
          var offsetX,offsetY;
          reOffset();
          window.onscroll=function(e){ reOffset(); }
          window.onresize=function(e){ reOffset(); }

         canvas.addEventListener('mousemove', function(e) {

            bubbleX=false;//clear out bubble

            e.preventDefault();
            e.stopPropagation();
            // mouse position
            mouseX=parseInt(e.clientX-offsetX);
            mouseY=parseInt(e.clientY-offsetY);
            // test if mouse is inside any shape(s)
            // and redraw different alpha based on hovering
            ctx.clearRect(0,0,cw,ch);
          //readraw the donuts
          drawDonut(data2,ctx,(radiusInner),radiusOuter,labels2,labels2keys,labels2Text,labels2Images,mouseX,mouseY); 
          drawDonut(data,ctx,(imageSize/2),radiusInner,labels,labelskeys,labelsText,false,mouseX,mouseY); 
          drawProfileImage(profileImage,ctx,user,grepperG,mouseX,mouseY);

          if(bubbleX){
              drawBubble(ctx,bubbleX,bubbleY,10,bubbleTextWidth,bubbleText);
          }

      });

         //resolve(canvas);

});
}

function drawProfileImage(profileImage,ctx,user,grepperG,mouseX,mouseY){

        ctx.save();
        ctx.beginPath();
        // use lineTo and BezierTo here to make the path you want, which is a rectangle the size of the image with two rounded corners.
        //go down
            ctx.arc( (canvasSizeWidth/2),  (canvasSizeHeight/2),  (imageSize/2), 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
          ctx.drawImage(profileImage,(canvasSizeWidth/2)-(imageSize/2),(canvasSizeHeight/2)-(imageSize/2),imageSize,imageSize);

          ctx.restore(); // so clipping path won't affect anything else drawn afterwards


          //draw the belt
          ctx.beginPath();
         //go down
          for(var r=0;r<=.3;r+=.01){
            var x = (canvasSizeWidth/2)+(Math.cos(r) * (imageSize/2));
            var y = (canvasSizeHeight/2)+(Math.sin(r) * (imageSize/2));
                  ctx.lineTo(x,y); 
          }
           for(var r=(Math.PI-.3);r<=Math.PI;r+=.01){
            var x = (canvasSizeWidth/2)+(Math.cos(r) * (imageSize/2));
            var y = (canvasSizeHeight/2)+(Math.sin(r) * (imageSize/2));
                  ctx.lineTo(x,y); 
          }

          //ctx.fillStyle ="rgba(0, 0, 0, 0.2)"; 

          ctx.fillStyle = "rgba("+hexToRgb(beltToColor(user.belt))+",0.8)";
          ctx.strokeStyle = "#000";
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          //draw the little grpper image
          ctx.drawImage(grepperG,(canvasSizeWidth/2)+((imageSize/2)*.7),(canvasSizeHeight/2),15,31);

          var beltLabel = user.belt.charAt(0).toUpperCase()+user.belt.slice(1)+" Belt";


          ctx.font = '16px arial';
          ctx.fillStyle = "#fff"; 
          ctx.fillStyle = beltToTextColor(user.belt); 
         var textWidth = ctx.measureText(beltLabel).width;
            ctx.fillText(beltLabel,(canvasSizeWidth/2)-(textWidth/2),(canvasSizeHeight/2)+20);
            ctx.closePath();


            //so now we draw for the popup stuff
            ctx.beginPath();
            ctx.moveTo((canvasSizeWidth/2),  (canvasSizeHeight/2));
            ctx.arc( (canvasSizeWidth/2),  (canvasSizeHeight/2),  (imageSize/2), 0, Math.PI * 2);
            //check if we are in path and show popup bubble if so
            if(ctx.isPointInPath(mouseX,mouseY)){
                              var userOverallText=user.short_name+" is a grepper "+user.belt+" belt which\nis equivalent to at least "+beltToExperience(user.belt)+"\n of programming experience.";
                              if(user.overall_percentile > .5){
                                   userOverallText+="\n"+user.short_name+" ranks in the top "+Math.round(user.overall_percentile*100)+"\npercentile of all developers";
                              }

                              bubbleX = (canvasSizeWidth/2)-30;
                              bubbleY = (canvasSizeHeight/2);
                              //bubbleTextWidth= ctx.measureText(userOverallText).width;
                              bubbleTextWidth= 1;
                              bubbleText = userOverallText;

            }
            ctx.closePath();
      

}

function drawShape(ctx,startRadian,endRadian,radiusInner,radius,label,labelskey,mouseX,mouseY){
                ctx.beginPath();
              
                  //ctx.globalAlpha=0.70;
                  var spacer = .00;
                  var inc=.001;
                 for(var r=startRadian+spacer;r<(endRadian-spacer);r+=inc){
                        var x = (canvasSizeWidth/2)+(Math.cos(r) * (radius));
                        var y = (canvasSizeHeight/2)+(Math.sin(r) * (radius));
                        ctx.lineTo(x,y); 
                  }

                  for(var r=(endRadian-spacer);r>(startRadian+spacer);r-=inc){
                    var x = (canvasSizeWidth/2)+(Math.cos(r) * (radiusInner));
                    var y = (canvasSizeHeight/2)+(Math.sin(r) * (radiusInner));
                      ctx.lineTo(x,y); 
                  }

                  //move back to the start
                 var x = (canvasSizeWidth/2)+(Math.cos(startRadian+spacer) * (radius));
                 var y = (canvasSizeHeight/2)+(Math.sin(startRadian+spacer) * (radius));
                  ctx.lineTo(x,y);

                ctx.fillStyle = "rgba("+hexToRgb(langToColor(labelskey))+",0.7)";
                   ctx.shadowColor = "transparent";
                    

                if(ctx.isPointInPath(mouseX,mouseY)){
                   // ctx.shadowOffsetX = 1;
                   // ctx.shadowOffsetY = 1;
                   // ctx.shadowColor = 'black';
                   // ctx.shadowBlur = 5;
                    ctx.fillStyle = "rgba("+hexToRgb(langToColor(labelskey))+",0.9)";
                }


                  ctx.fill();
                  ctx.strokeStyle ="rgba(0, 0, 0, 1.0)"; 
                  ctx.stroke();
              ctx.closePath();

}

function drawLabels(ctx,startRadian,endRadian,radiusInner,radius,label,labelskey,labelImage,mouseX,mouseY){
            //draw in the labels
            ctx.font = '14px arial';
            var textWidth = ctx.measureText(label).width;
            var pointAngleInRadians=(startRadian+endRadian)/2;
            var x = (canvasSizeWidth/2)+(Math.cos(pointAngleInRadians) * ((radius+radiusInner)/2));
            var y = (canvasSizeHeight/2)+(Math.sin(pointAngleInRadians) * ((radius+radiusInner)/2));

			if(label =="Shell/Bash"){
              ctx.fillStyle = "#fff"; 
			}else{
              ctx.fillStyle = "#000000"; 
			}

          if(labelImage){
            //bring labels with imags up a little bit
            ctx.fillText(label, x-(textWidth/2), y-5);
          }else{
            ctx.fillText(label, x-(textWidth/2), y+5);
          }

          if(labelImage){
                  ctx.shadowOffsetX = 1;
                  ctx.shadowOffsetY = 1;
                  ctx.shadowColor = 'black';
                  ctx.shadowBlur = 2;
                if(labelImage.complete){
                    ctx.drawImage(labelImage,x-10,y-5+4,20,20);
                    ctx.shadowColor = "transparent";
                }else{
                    labelImage.onload = function(){
                        ctx.drawImage(labelImage,x-10,y-5+4,20,20);
                        ctx.shadowColor = "transparent";
                    }
                }
          }
}

function drawDonut(data,ctx,radiusInner,radius,labels,labelskeys,labelsText,labelsImages,mouseX,mouseY){
            var startRadian = 0;
            var runningSum=0;
            var endRadian = 0;
            for (let i = 0; i < data.length; i++) {
                        runningSum+=data[i];
                        endRadian = Math.PI*runningSum*2;
                        drawShape(ctx,startRadian,endRadian,radiusInner,radius,labels[i],((labelskeys)?labelskeys[i]:false),mouseX,mouseY);


                      if(mouseX){
                           if(ctx.isPointInPath(mouseX,mouseY)){
                              var pointAngleInRadians=(startRadian+endRadian)/2;
                                  bubbleX = (canvasSizeWidth/2)+(Math.cos(pointAngleInRadians) * ((radius+radiusInner)/2));
                                  bubbleY = (canvasSizeHeight/2)+(Math.sin(pointAngleInRadians) * ((radius+radiusInner)/2));
                                  bubbleTextWidth= ctx.measureText(labels[i]).width;
                                  bubbleText = labelsText[i];

                                //ctx.globalAlpha=1.00;
                            }else{
                                //ctx.globalAlpha=0.70;
                            }
                            //ctx.fill();
                      }

                        drawLabels(ctx,startRadian,endRadian,radiusInner,radius,labels[i],((labelskeys)?labelskeys[i]:false),((labelsImages)?labelsImages[i]:false),mouseX,mouseY);

                        startRadian=endRadian;
            }

            
}

function drawBubble(ctx, xo, yo, radius,textWidth,text){
    var lineheight = 16;
    var lines = text.split('\n');
    var h=0;
    var w=0;
    var padding=6;
    
    ctx.font = '14px arial';
    //calculate w/height
    for (var i = 0; i<lines.length; i++){
        if(ctx.measureText(lines[i]).width > w){
            w = ctx.measureText(lines[i]).width;
        }
        h+=lineheight;
    }
       h+=(padding*2)
       w+=(padding*2)

    var x=(xo+(textWidth/2)+22);
    var y=(yo-(h/2)); 

    var flipped=false;
    if(x > (canvasSizeWidth/2)){
        flipped=true;
        x=(xo-w-(textWidth/2)-22);
    }

   

      var r = x + w;
      var b = y + h;
      ctx.beginPath();
      ctx.strokeStyle="black";
      ctx.fillStyle ="rgba(0, 0, 0, 0.9)"; 
      //ctx.lineWidth="4";

      //move to top left
      ctx.moveTo(x+radius, y);

      //linto top right
      ctx.lineTo(r-radius, y);
      ctx.quadraticCurveTo(r, y, r, y+radius);

     if(flipped){
          ctx.lineTo(r, (y+radius+(h/8)));
          ctx.lineTo(r+15, y+(h/2));
          ctx.lineTo(r, (b-radius-(h/8)));
      }

      //line to bottom right
      ctx.lineTo(r, b-radius);
      ctx.quadraticCurveTo(r, b, r-radius, b);

       //link to bottom left
      ctx.lineTo(x+radius, b);
      ctx.quadraticCurveTo(x, b, x, b-radius);
      
      //line up a bit
      if(!flipped){
          ctx.lineTo(x, (b-radius-(h/8)));
          ctx.lineTo(x-15, y+(h/2));
          ctx.lineTo(x, (y+radius+(h/8)));
      }

      ctx.lineTo(x, y+radius);
      ctx.quadraticCurveTo(x, y, x+radius, y);
      ctx.stroke();
      ctx.fill();

    ctx.font = '14px arial';
    ctx.fillStyle = "#fff"; 
    //draw in the 
    for (var i = 0; i<lines.length; i++){
        ctx.fillText(lines[i], (x+padding), padding+y+((i+.8)*lineheight));
    }
}


        
    //ctx.moveTo(canvasSize/2,canvasSize/2);
    //ctx.arc(canvasSize/2,canvasSize/2, radiusInner/2,0,(2*Math.PI),true);
    //ctx.fill();

function langToColor(lang){
var colors={
"php":"#55468c",
"javascript":"#72bf3b",
"html":"#f2cd5c",
"python":"#3475aa",
"css":"#f24141",
"shell":"#000",
"sql":"#00608A",
"whatever":"#CB7F58",
"java":"#E76F00",
"csharp":"#68207A",
"abap":"#fe7459",
"actionscript":"#515bcf",
"assembly":"#4b992e",
"basic":"#7b13f9",
"c":"#9dc3ea",
"clojure":"#a4e52c",
"cobol":"#903413",
"cpp":"#7f5b75",
"dart":"#9bdf4e",
"delphi":"#042bc3",
"elixir":"#5bff97",
"erlang":"#419e8e",
"fortran":"#629ba0",
"fsharp":"#f50572",
"go":"#4245fe",
"groovy":"#8adec7",
"haskell":"#557c59",
"julia":"#b9e2a2",
"kotlin":"#3f2f44",
"language":"#c604b2",
"lisp":"#9f55cb",
"lua":"#e5d1db",
"matlab":"#cf9d38",
"objectivec":"#622c93",
"pascal":"#e30fc4",
"perl":"#52c69c",
"postscript":"#353d9f",
"prolog":"#32d169",
"r":"#6f445c",
"ruby":"#eca49c",
"rust":"#1d88f7",
"scala":"#843d0c",
"scheme":"#95fda0",
"smalltalk":"#fcd3ae",
"swift":"#91b7b6",
"term":"#4f3958",
"typescript":"#cddf5c",
"vb":"#13e03d",
"webassembly":"#f3e333",

"angular":"#e23237",
"backbone":"#0071b5",
"bootstrap":"#563d7c",
"bootstrapcss":"#563d7c",
"bulma":"#00d1b2",
"cakephp":"#d33c45",
"codeigniter":"#ef4123",
"django":"#092e20",
"drupal":"#008ecf",
"ember":"#e05c43",
"express":"#4d4d4d",
"flask":"#000000",
"flutter":"#45d1fd",
"foundation":"#81d2e5",
"ionic":"#478aff",
"jquery":"#1069ad",
"laravel":"#ff2d20",
"materialize":"#f6a2ad",
"nextjs":"#404040",
"nodejs":"#539e43",
"react":"#61dafb",
"semantic":"#35bdb2",
"skeleton":"#111111",
"spring":"#6db33f",
"symfony":"#81e83e",
"unity":"#4a3d75",
"vaadin":"#00b4f0",
"vue":"#3a6168",
"wordpress":"#0087be",
"yii":"#eb6e2e",
"zend":"#68b604",
};

return colors[lang];
}

function beltToExperience(belt){
   var  colors={
        white:"2 Month",
        yellow:"4 Months",
        orange:"8 Months",
        green:"1 Year",
        blue:"2 Years",
        purple:"4 Years",
        brown:"8 Years",
        black:"20 Years"
    };
    return colors[belt];
}



function beltToTextColor(belt){
   var  colors={
        white:"#000",
        yellow:"#000",
        orange:"#000",
        green:"#000",
        blue:"#fff",
        purple:"#fff",
        brown:"#fff",
        black:"#fff"
    };
    return colors[belt];
}

function beltToColor(belt){
   var  colors={
        white:"#F0F8FF",
        yellow:"#f2cd5c",
        orange:"#F29F41",
        green:"#72bf3b",
        blue:"#365FA0",
        purple:"#55468c",
        brown:"#8B4513",
        black:"#000000"
    };
    return colors[belt];
}

function LightenDarkenColor(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

function hexToRgb(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(result){
      var r= parseInt(result[1], 16);
      var g= parseInt(result[2], 16);
      var b= parseInt(result[3], 16);
      return r+","+g+","+b;//return 23,14,45 -> reformat if needed
  }
  return null;
}