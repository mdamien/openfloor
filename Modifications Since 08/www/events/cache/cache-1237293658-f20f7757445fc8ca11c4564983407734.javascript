

var username = '';
var site_url = '';
var event_name;
var sort;
var tag = '';
var offset = 0;
var ajaxOn = true;

function init() {
	
	
}

//init obj
if(typeof ajaxVideo === "undefined" || !ajaxVideo) {
	var ajaxVideo = {
		savingMsg: "Saving ..."
	};
}

//init vars
ajaxVideo.supported = true; // supported on current page and by browser
ajaxVideo.inprogress = false; // ajax request in progress
ajaxVideo.timeoutID = null; 
ajaxVideo.videoID = '';

//main call function
/**
 * this function is the main function that should be called
 * 
 * @param string id the you tube video id
 */
ajaxVideo.ajaxCall = function(id) {
	if(!ajaxVideo.supported || ajaxVideo.inprogress) {
		return;
	}

	ajaxVideo.inprogress = true;
	ajaxVideo.videoID = id;


	//make the AJAX Calls
	new Ajax.Request(site_url+'', {
	  method:'post',
	  onSuccess: function(transport){
	     var json = transport.responseText.evalJSON();
	   }
	});
	// if the request isn't done in 20 seconds, allow user to try again
	ajaxVideo.timeoutID = window.setTimeout(function() { ajaxVideo.inprogress = false; }, 20000);
	return;
};
/**
 * this function will get the details of a youtube video via the video id
 * 
 * @param string id the
 */
ajaxVideo.youTubeVideoDetails = function(id) {
	if(!ajaxVideo.supported || ajaxVideo.inprogress) {
		alert('busy');
		return;
	}

	ajaxVideo.inprogress = true;
	//see if we have a video id
	ajaxVideo.videoID = ajaxVideo.getVideoID(id);

	//do some sexy time
	$('videoNext').innerHTML= '<br />Loading..<br />';
	$('errorArea').innerHTML = ' ';
	
	//make the AJAX Calls
	new Ajax.Request(site_url+'/video/youTubeAjax/', {
	  method:'post',	  
  	parameters: {video_id: ajaxVideo.videoID},
	  onSuccess: function(transport){	   	  	 
	     var json = transport.responseText; 
	     var jsonObj = eval("("+json+")");
	     if (jsonObj.code) {
	     	 $('errorArea').innerHTML = jsonObj.description;
	     	 new Effect.Shake ('errorArea');
	     	 var my_input = document.createElement('input');

				 Element.extend(my_input);
				 my_input.id='videoDetailsButton';
				 my_input.type='button';
				 my_input.value='Next >';
				 my_input.addClassName('button');
	     	 my_input.show();
				
				 $('videoNext').innerHTML = '';
				 // insert it in the document
				 $('videoNext').appendChild(my_input);
				 Event.observe($('videoDetailsButton'),'click',function(){ajaxVideo.youTubeVideoDetails($F('youtube'))});
	     	 ajaxVideo.inprogress = false;
	     	 return;
	     }
	     $('youtube').value = ajaxVideo.videoID;
	     Element.extend($('videoNext')).hide();
	     new Effect.BlindDown ('videoDetails'); 
			 
	     $('video').value = jsonObj.title;
	     var desc = jsonObj.description;
	     $('desc').value = desc.substring(0,250);
	     $('thumbnail').value = jsonObj.thumbnail_url;
	     var tags = jsonObj.tags;
	     //$('tags').value = tags.replace(/ /g,', ');
	     $('tags').value = tags;	     
	   }
	});
	return;
};

ajaxVideo.playYouTubeVideo = function(id) {
	if(!ajaxVideo.supported) return;
		
		var vid_element = $('ytvid_'+id);
		//console.log(id);
		vid_element.innerHTML = '<embed src="http://www.youtube.com/v/'+id+'&autoplay=1" type="application/x-shockwave-flash" wmode="transparent" width="325" height="250"></embed>';
}

/**
* this fucntion get the video id from some youtube code
*
*/
ajaxVideo.youTubeVideoID = function() {
	if(!ajaxVideo.supported) return;
		
		var code = $F('youtube_code');
		var video_id = ajaxVideo.getVideoID(code);
		ajaxVideo.youTubeVideoDetails(video_id);
		hideBox('hijax');	
}

ajaxVideo.getVideoID = function(code) {
	if(!ajaxVideo.supported) return;
	
		var array = code.split('/v/');
		if (array[1]) {
			array = array[1].split('"');
			var video_id = array[0];		
		} else {
			array = code.split('?v=');
			if (array[1]) var video_id = array[1];
			else var video_id = code;
		}
		//console.log ('vid->'+video_id);
		return video_id;
	
}

//init obj
if(typeof queueUpdater === "undefined" || !queueUpdater) {
	var queueUpdater = {
		savingMsg: "Saving ..."
	};
}

queueUpdater.updateQueue = function() {
	queueUpdater.updaterObject = new Ajax.PeriodicalUpdater('queue', site_url + '/forums/ajQueueUpdater/' + event_name + '/' + sort + '/' + offset + '/' + tag, {
	  frequency: 10
	});
	
	//new Ajax.PeriodicalUpdater('timer', site_url + '/forums/createTimerHTML/' + event_name, {frequency:10});
}

queueUpdater.updateQueueOnce = function() {
	
	new Ajax.Updater('queue', site_url + '/forums/ajQueueUpdater/' + event_name + '/' + sort + '/' + offset + '/' + tag);
	//new Effect.SlideDown ('queue');
}


queueUpdater.vote = function(url,id) {	
	//new Effect.DropOut ('queue');
	if (username.length <= 0) {
		showBox('login');
		return;
	}
	new Effect.Opacity (id,{duration:.5, from:1.0, to:0.7});
	new Ajax.Request(url, {
	  onSuccess: function(transport) {
		  queueUpdater.updateQueueOnce();
	  }
	});
}

queueUpdater.flagquestion = function(question_id, type_id, reporter_id) {
	url = site_url + '/flag/flagQuestion/' + question_id + '/' + type_id + '/' + reporter_id;
	if (username.length <= 0) {
		showBox('login');
		return;
	}
	new Ajax.Request(url, {
	  onSuccess: function(transport) {
		  queueUpdater.updateQueueOnce();
	  }
	});
}

queueUpdater.flaguser = function(user_id, type_id, reporter_id) {
	url = site_url + '/flag/flagUser/' + user_id + '/' + type_id + '/' + reporter_id;
	if (username.length <= 0) {
		showBox('login');
		return;
	}
	new Ajax.Request(url, {
	  onSuccess: function(transport) {
		  queueUpdater.updateQueueOnce();
	  }
	});
}

queueUpdater.toggleQueue = function () {
	if(ajaxOn) { ajaxOn=false; queueUpdater.updaterObject.stop(); }
	else if ($$('div[class=flag-question]', 'div[class=flag-user]').collect(function(n){ return n.getStyle('display'); }).indexOf('block') == -1) { ajaxOn=true; queueUpdater.updaterObject.start(); }
}

queueUpdater.toggleVisibility = function(element) {
	$$('div[class=flag-question]', 'div[class=flag-user]', 'div[class=watch_question]').without($(element)).invoke('setStyle', {display:'none'});
	style = $(element).getStyle('display') == 'none' ? {display:'block'} : {display:'none'};
	$(element).setStyle(style);
}

queueUpdater.watch = function(id) {
	exec = '<script type="text/javascript" charset="utf-8">Tips.tips.each(function(s){console.log(s)})</script>';
	
	url = site_url + 'forums/watch_answer/' + id;
	
	new Ajax.Request(url, {
		onSuccess: function(transport) {
			new Tip($('watch_' + id), exec + transport.responseText, {className: 'rp', title: 'Watch', showOn: 'click', hideOn: 'click', closeButton: true});
		}
	});
}

<!--
/*
function init ( )
{
	timeDisplay = document.createTextNode ( "" );
  document.getElementById("clock").appendChild ( timeDisplay );
}
*/
function updateClock ( )
{
  var currentTime = new Date ( );

  var currentHours = currentTime.getHours ( );
  var currentMinutes = currentTime.getMinutes ( );
  var currentSeconds = currentTime.getSeconds ( );

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Choose either "AM" or "PM" as appropriate
  var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

  // Convert the hours component to 12-hour format if needed
  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  // Convert an hours component of "0" to "12"
  currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

  // Update the time display
  document.getElementById("clock").firstChild.nodeValue = currentTimeString;
	//$('clock').innerHTML = currentTimeString;
}

// -->

//  Lightview 2.0.1 - 26-02-2008
//  Copyright (c) 2008 Nick Stakenburg (http://www.nickstakenburg.com)
//
//  Licensed under a Creative Commons Attribution-No Derivative Works 3.0 Unported License
//  http://creativecommons.org/licenses/by-nd/3.0/

//  More information on this project:
//  http://www.nickstakenburg.com/projects/lightview/

var Lightview = {
  Version: '2.0.1',

  // Configuration
  options: {
    backgroundColor: '#cccccc',                            // Background color of the view
    border: 5,                                            // Size of the border
    buttons: { opacity: { normal: 0.65, hover: 1 } },      // Opacity of inner buttons
    cyclic: false,                                         // Makes galleries/sets cyclic, no end/begin.
    images: '../images/lightview/',                        // The directory of the images, from this file
    imgNumberTemplate: 'Image #{position} of #{total}',    // Want a different language? change it here
    overlay: {                                             // Overlay
      background: '#444D3E',                                  // Background color, Mac Firefox & Safari use overlay.png
      opacity: 0.85,
      display: false
    },
    preloadHover: true,                                    // Preload images on mouseover
    radius: 12,                                            // Corner radius of the border
    removeTitles: true,                                    // Set to false if you want to keep title attributes intact
    resizeDuration: .1,                                   // When effects are used, the duration of resizing in seconds
    slideshow: { delay: 5, display: true },                // Seconds each image is visible in slideshow
    titleSplit: '::',                                      // The characters you want to split title with
    transition: function(pos) {                            // Or your own transition
      return ((pos/=0.5) < 1 ? 0.5 * Math.pow(pos, 4) :
        -0.5 * ((pos-=2) * Math.pow(pos,3) - 2));
    },
    viewport: true,                                        // Stay within the viewport, true is recommended
    zIndex: 5000,                                          // zIndex of #lightview, #overlay is this -1

    // Optional
    closeDimensions: {                                     // If you've changed the close button you can change these
      large: { width: 85, height: 22 },                    // not required but it speeds things up.
      small: { width: 32, height: 22 },
      innertop: { width: 22, height: 22 },
      topclose: { width: 22, height: 18 }                  // when topclose option is used
    },
    defaultOptions : {                                     // Default open dimensions for each type
      ajax:   { width: 400, height: 300 },
      iframe: { width: 400, height: 300, scrolling: true },
      inline: { width: 400, height: 300 },
      flash:  { width: 400, height: 300 },
      quicktime: { width: 480, height: 220, autoplay: true, controls: true, topclose: true }
    },
    sideDimensions: { width: 16, height: 22 }              // see closeDimensions
  },

  classids: {
    quicktime: 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
    flash: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'
  },
  codebases: {
    quicktime: 'http://www.apple.com/qtactivex/qtplugin.cab#version=7,3,0,0',
    flash: 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0'
  },
  errors: {
    requiresPlugin: "<div class='message'>The content your are attempting to view requires the <span class='type'>#{type}</span> plugin.</div><div class='pluginspage'><p>Please download and install the required plugin from:</p><a href='#{pluginspage}' target='_blank'>#{pluginspage}</a></div>"
  },
  mimetypes: {
    quicktime: 'video/quicktime',
    flash: 'application/x-shockwave-flash'
  },
  pluginspages: {
    quicktime: 'http://www.apple.com/quicktime/download',
    flash: 'http://www.adobe.com/go/getflashplayer'
  },
  // used with auto detection
  typeExtensions: {
    flash: 'swf',
    image: 'bmp gif jpeg jpg png',
    iframe: 'asp aspx cgi cfm htm html php pl php3 php4 php5 phtml rb rhtml shtml txt',
    quicktime: 'avi mov mpg mpeg movie'
  }
};

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('Z.1d(W.14,{27:(W.14.3k&&(/9x 6./).4r(2H.4a)),2m:(W.14.3i&&!19.4W)});Z.1d(1k,{8H:"1.6.0.2",80:"1.8.1",V:{1n:"43",2T:"12"},5g:!!2H.4a.3z(/52/i),4F:!!2H.4a.3z(/52/i)&&(W.14.3i||W.14.2h),4X:f(A){9((8j 1X[A]=="8d")||(7.4h(1X[A].7Z)<7.4h(7["5X"+A]))){7K("1k 7I "+A+" >= "+7["5X"+A]);}},4h:f(A){n B=A.2B(/5v.*|\\./g,"");B=42(B+"0".7r(4-B.1V));z A.1J("5v")>-1?B-1:B},5e:f(){7.4X("W");9(!!1X.Y&&!1X.55){7.4X("55")}n A=/12(?:-[\\w\\d.]+)?\\.9w(.*)/;7.1l=(($$("9h 99[1q]").6p(f(B){z B.1q.3z(A)})||{}).1q||"").2B(A,"")+7.o.1l;9(W.14.3k&&!19.6w.v){19.6w.6f("v","8v:8s-8p-8n:8i");19.18("4t:4q",f(){19.8c().89("v\\\\:*","87: 1B(#63#83);")})}},4f:f(){7.2F=7.o.2F;7.1b=(7.2F>7.o.1b)?7.2F:7.o.1b;7.1u=7.o.1u;7.1s=7.o.1s;7.5S();7.5P();7.5M()},5S:f(){n B,I,D=7.1N(7.1s);$(19.3P).y({1c:(j u("X",{2j:"2U"}).13())}).y({1c:(7.12=j u("X",{2j:"12"}).q({3m:7.o.3m,1c:"-3l",1g:"-3l"}).1R(0).y(7.3Z=j u("X",{U:"79"}).y(7.3r=j u("2X",{U:"73"}).y(7.5c=j u("1E",{U:"6Y"}).q(I=Z.1d({1v:-1*7.1s.k+"r"},D)).y(7.3g=j u("X",{U:"3U"}).q(Z.1d({1v:7.1s.k+"r"},D)).y(j u("X",{U:"21"})))).y(7.6M=j u("1E",{U:"9r"}).q(Z.1d({6I:-1*7.1s.k+"r"},D)).y(7.3R=j u("X",{U:"3U"}).q(I).y(j u("X",{U:"21"}))))).y(7.4E=j u("X",{U:"9c"}).y(7.3O=j u("X",{U:"3U 97"}).y(j u("X",{U:"21"})))).y(j u("2X",{U:"94"}).y(j u("1E",{U:"6s 91"}).y(B=j u("X",{U:"8Z"}).q({m:7.1b+"r"}).y(j u("2X",{U:"6z 8O"}).y(j u("1E",{U:"6x"}).y(j u("X",{U:"3T"})).y(j u("X",{U:"38"}).q({1g:7.1b+"r"})))).y(j u("X",{U:"6K"})).y(j u("2X",{U:"6z 8y"}).y(j u("1E",{U:"6x"}).q({1z:-1*7.1b+"r"}).y(j u("X",{U:"3T"})).y(j u("X",{U:"38"}).q({1g:-1*7.1b+"r"})))))).y(7.4B=j u("1E",{U:"8r"}).q({m:(8q-7.1b)+"r"}).y(j u("X",{U:"8o"}).y(j u("X",{U:"6d"}).q({1z:7.1b+"r"}).y(7.2K=j u("X",{U:"8m"}).1R(0).q({3K:"0 "+7.1b+"r"}).y(7.1U=j u("X",{U:"8h 38"})).y(7.1F=j u("X",{U:"8g"}).y(7.4s=j u("X",{U:"8f"}).q(7.1N(7.o.1u.4p)).y(7.4m=j u("a",{U:"21"}).1R(7.o.3D.24.4k))).y(7.3B=j u("2X",{U:"85"}).y(7.4i=j u("1E",{U:"84"}).y(7.1r=j u("X",{U:"82"})).y(7.1I=j u("X",{U:"7Y"}))).y(7.3y=j u("1E",{U:"7V"}).y(j u("X"))).y(7.2E=j u("1E",{U:"7Q"}).y(7.2G=j u("a",{U:"21"}).1R(7.o.3D.24.4k).q("1O: 1B("+7.1l+"4c.26) 1c 1g 2C-2J"))))).y(7.1M=j u("X",{U:"7H"}))))).y(7.2L=j u("X",{U:"7E"}).y(7.6m=j u("X",{U:"21"}).q({1O:"1B("+7.1l+"2L.49) 1c 1g 2C-2J"})))).y(j u("1E",{U:"6s 7B"}).y(B.7z(1T))).y(7.1L=j u("1E",{U:"7y"}).13().q({1z:7.1b+"r",1O:"1B("+7.1l+"7v.49) 1c 1g 2J"})))))}).y({1c:(7.1D=j u("X",{2j:"1D"}).q({3m:7.o.3m-1,1n:(!(W.14.2h||W.14.27))?"5A":"3q",1O:7.4F?"1B("+7.1l+"1D.3Q) 1c 1g 2J":7.o.1D.1O}).1R((W.14.2h)?1:7.o.1D.24).13())});n H=j 2t();H.1w=f(){H.1w=W.23;7.1s={k:H.k,m:H.m};n K=7.1N(7.1s),C;7.3r.q({1z:0-(H.m/2).2O()+"r",m:H.m+"r"});7.5c.q(C=Z.1d({1v:-1*7.1s.k+"r"},K));7.3g.q(Z.1d({1v:K.k},K));7.6M.q(Z.1d({6I:-1*7.1s.k+"r"},K));7.3R.q(C)}.S(7);H.1q=7.1l+"2Z.3Q";$w("1r 1I 3y").1j(f(C){7[C].q({2k:7.o.2k})}.S(7));n G=7.3Z.2Q(".3T");$w("7q 7p 7n 5o").1j(f(K,C){9(7.2F>0){7.5l(G[C],K)}10{G[C].y(j u("X",{U:"38"}))}G[C].q({k:7.1b+"r",m:7.1b+"r"}).7g("3T"+K.2y())}.S(7));7.12.2Q(".6K",".38",".6d").2W("q",{2k:7.o.2k});n E={};$w("2Z 1t 22").1j(f(K){7[K+"2x"].3s=K;n C=7.1l+K+".3Q";9(K=="22"){E[K]=j 2t();E[K].1w=f(){E[K].1w=W.23;7.1u[K]={k:E[K].k,m:E[K].m};n L=7.5g?"1g":"78",M=Z.1d({"77":L,1z:7.1u[K].m+"r"},7.1N(7.1u[K]));M["3K"+L.2y()]=7.1b+"r";7[K+"2x"].q(M);7.4E.q({m:E[K].m+"r",1c:-1*7.1u[K].m+"r"});7[K+"2x"].5f().q(Z.1d((!W.14.27?{1O:"1B("+C+")"}:{61:"5R:5d.5Q.5O(1q=\'"+C+"\'\', 5a=\'4d\')"}),7.1N(7.1u[K])))}.S(7);E[K].1q=7.1l+K+".3Q"}10{7[K+"2x"].q(!W.14.27?{1O:"1B("+C+")"}:{61:"5R:5d.5Q.5O(1q=\'"+C+"\'\', 5a=\'4d\')"})}}.S(7));n A={};$w("4p 58 56").1j(f(C){A[C]=j 2t();A[C].1w=f(){A[C].1w=W.23;7.1u[C]={k:A[C].k,m:A[C].m}}.S(7);A[C].1q=7.1l+"6W"+C+".26"}.S(7));n J=j 2t();J.1w=f(){J.1w=W.23;7.2L.q({k:J.k+"r",m:J.m+"r",1z:-0.5*J.m+0.5*7.1b+"r",1v:-0.5*J.k+"r"})}.S(7);J.1q=7.1l+"2L.49";n F=j 2t();F.1w=f(){F.1w=W.23;7.2G.q({k:F.k+"r",m:F.m+"r"})}.S(7);F.1q=7.1l+"4c.26"},51:f(){Y.2I.2M("12").1j(f(A){A.4Z()});7.1p=1m;7.4l();7.1f=1m},4l:f(){9(!7.3e||!7.3d){z}7.3d.y({9q:7.3e.q({1K:7.3e.6J})});7.3d.1Z();7.3d=1m},17:f(B){7.1C=1m;9(Z.6F(B)||Z.6C(B)){7.1C=$(B);7.1C.9a();7.h=7.1C.1G}10{9(B.1a){7.1C=$(19.3P);7.h=j 1k.4N(B)}10{9(Z.6i(B)){7.1C=7.4P(7.h.1i).4M[B];7.h=7.1C.1G}}}9(!7.h.1a){z}7.51();7.4K();7.6n();7.6l();7.3b();7.6k();9(7.h.1a!="#2U"&&Z.6j(1k.4Q).6G(" ").1J(7.h.11)>=0){9(!1k.4Q[7.h.11]){$("2U").1x(j 6y(7.8K.8I).4W({11:7.h.11.2y(),4D:7.4G[7.h.11]}));n C=$("2U").2i();7.17({1a:"#2U",1r:7.h.11.2y()+" 8D 8B",o:C});z 2e}}9(7.h.1P()){7.1f=7.h.1P()?7.4V(7.h.1i):[7.h]}n A=Z.1d({1F:1T,22:2e},7.o.8u[7.h.11]||{});7.h.o=Z.1d(A,7.h.o);9(!(7.h.1r||7.h.1I||(7.1f&&7.1f.1V>1))&&7.h.o.22){7.h.o.1F=2e}9(7.h.2D()){9(7.h.1P()){7.1n=7.1f.1J(7.h);7.6e()}7.1y=7.h.3M;9(7.1y){7.3f()}10{7.4z();n D=j 2t();D.1w=f(){D.1w=W.23;7.3h();7.1y={k:D.k,m:D.m};7.3f()}.S(7);D.1q=7.h.1a}}10{7.1y=7.h.o.4y?19.2g.2i():{k:7.h.o.k,m:7.h.o.m};7.3f()}},4x:f(){n D=7.6c(7.h.1a),A=7.1p||7.1y;9(7.h.2D()){n B=7.1N(A);7.1U.q(B).1x(j u("6b",{2j:"1Q",1q:7.h.1a,8l:"",8k:"2C"}).q(B))}10{9(7.h.3J()){9(7.1p&&7.h.o.4y){A.m-=7.2S.m}3I(7.h.11){2f"2R":n F=Z.3H(7.h.o.2R)||{};n E=f(){7.3h();9(7.h.o.4v){7.1M.q({k:"4u",m:"4u"});7.1y=7.3G(7.1M)}j Y.1e({V:7.V,1o:7.3F.S(7)})}.S(7);9(F.3E){F.3E=F.3E.2l(f(N,M){E();N(M)})}10{F.3E=E}7.4z();j 8e.8b(7.1M,7.h.1a,F);1W;2f"2a":7.1M.1x(7.2a=j u("2a",{8a:0,88:0,1q:7.h.1a,2j:"1Q",1Y:"1Q",69:(7.h.o&&7.h.o.69)?"4u":"2C"}).q(Z.1d({1b:0,68:0,3K:0},7.1N(A))));1W;2f"3C":n C=7.h.1a,H=$(C.66(C.1J("#")+1));9(!H||!H.4j){z}n L=j u(7.h.o.86||"X"),G=H.1H("2b"),J=H.1H("1K");H.2l(L);H.q({2b:"3A"}).17();n I=7.3G(L);H.q({2b:G,1K:J});L.y({64:H}).1Z();H.y({64:7.3d=j u(H.4j)});H.6J=H.1H("1K");7.3e=H.17();7.1M.1x(7.3e);9(7.h.o.4v){7.1y=I;j Y.1e({V:7.V,1o:7.3F.S(7)})}1W}}10{n K={1A:"33",2j:"1Q",k:A.k,m:A.m};3I(7.h.11){2f"2p":Z.1d(K,{4D:7.4G[7.h.11],32:[{1A:"28",1Y:"62",2n:7.h.o.62},{1A:"28",1Y:"4d",2n:"81"},{1A:"28",1Y:"7X",2n:7.h.o.4e},{1A:"28",1Y:"7W",2n:1T},{1A:"28",1Y:"1q",2n:7.h.1a},{1A:"28",1Y:"5Z",2n:7.h.o.5Z||2e}]});Z.1d(K,W.14.3k?{7U:7.7T[7.h.11],7S:7.7R[7.h.11]}:{3B:7.h.1a,11:7.5Y[7.h.11]});1W;2f"2Y":Z.1d(K,{3B:7.h.1a,11:7.5Y[7.h.11],7P:"7O",4D:7.4G[7.h.11],32:[{1A:"28",1Y:"7N",2n:7.h.1a}]});9(7.h.o){K.7M=7.h.o.7L}1W}7.1U.q(7.1N(A)).17();7.1U.1x(7.4g(K));9(7.h.5V()&&$("1Q")){(f(){3v{9("5U"5T $("1Q")){$("1Q").5U(7.h.o.4e)}}3u(M){}}.S(7)).2o(0.4)}}}},3G:f(B){B=$(B);n A=B.7J(),C=[],E=[];A.3t(B);A.1j(f(F){9(F!=B&&F.3L()){z}C.3t(F);E.3t({1K:F.1H("1K"),1n:F.1H("1n"),2b:F.1H("2b")});F.q({1K:"6g",1n:"3q",2b:"3L"})});n D={k:B.7G,m:B.7F};C.1j(f(G,F){G.q(E[F])});z D},4Y:f(){n A=$("1Q");9(A){3I(A.4j.4R()){2f"33":9(W.14.3i&&7.h.5V()){3v{A.5L()}3u(B){}A.7D=""}9(A.7C){A.1Z()}10{A=W.23}1W;2f"2a":A.1Z();9(W.14.2h){5K 1X.7A.1Q}1W;63:A.1Z();1W}}},5J:f(){n A=7.1p||7.1y;9(7.h.o.4e){3I(7.h.11){2f"2p":A.m+=16;1W}}7[(7.1p?"5I":"i")+"5H"]=A},3f:f(){j Y.1e({V:7.V,1o:f(){7.5G()}.S(7)})},5G:f(){7.3c();7.5F();9(!7.h.5E()){7.3h()}9(!((7.h.o.4v&&7.h.7x())||7.h.5E())){7.3F()}9(!7.h.5D()){j Y.1e({V:7.V,1o:7.4x.S(7)})}},5C:f(){j Y.1e({V:7.V,1o:7.5B.S(7)});9(7.h.5D()){j Y.1e({2o:0.15,V:7.V,1o:7.4x.S(7)})}9(7.2N){j Y.1e({V:7.V,1o:7.5z.S(7)})}},2s:f(){7.17(7.2A().2s)},1t:f(){7.17(7.2A().1t)},3F:f(){7.5J();n B=7.47(),D=7.5y();9(7.o.2g&&(B.k>D.k||B.m>D.m)){9(!7.h.o.4y){n E=Z.3H(7.5x()),A=D,C=Z.3H(E);9(C.k>A.k){C.m*=A.k/C.k;C.k=A.k;9(C.m>A.m){C.k*=A.m/C.m;C.m=A.m}}10{9(C.m>A.m){C.k*=A.m/C.m;C.m=A.m;9(C.k>A.k){C.m*=A.k/C.k;C.k=A.k}}}n F=(C.k%1>0?C.m/E.m:C.m%1>0?C.k/E.k:1);7.1p={k:(7.1y.k*F).2O(),m:(7.1y.m*F).2O()};7.3c();B={k:7.1p.k,m:7.1p.m+7.2S.m}}10{7.1p=D;7.3c();B=D}}10{7.3c();7.1p=1m}7.3S(B)},3S:f(B){n F=7.12.2i(),I=2*7.1b,D=B.k+I,M=B.m+I;7.46();n L=f(){7.3b();7.4T=1m;7.5C()};9(F.k==D&&F.m==M){L.S(7)();z}n C={k:D+"r",m:M+"r"};9(!W.14.27){Z.1d(C,{1v:0-D/2+"r",1z:0-M/2+"r"})}n G=D-F.k,K=M-F.m,J=42(7.12.1H("1v").2B("r","")),E=42(7.12.1H("1z").2B("r",""));9(!W.14.27){n A=(0-D/2)-J,H=(0-M/2)-E}7.4T=j Y.7u(7.12,0,1,{1S:7.o.7t,V:7.V,5u:7.o.5u,1o:L.S(7)},f(Q){n N=(F.k+Q*G).2P(0),P=(F.m+Q*K).2P(0);9(W.14.27){7.12.q({k:(F.k+Q*G).2P(0)+"r",m:(F.m+Q*K).2P(0)+"r"});7.4B.q({m:P-1*7.1b+"r"})}10{n O=19.2g.2i(),R=19.2g.5t();7.12.q({1n:"3q",1v:0,1z:0,k:N+"r",m:P+"r",1g:(R[0]+(O.k/2)-(N/2)).2V()+"r",1c:(R[1]+(O.m/2)-(P/2)).2V()+"r"});7.4B.q({m:P-1*7.1b+"r"})}}.S(7))},5B:f(){j Y.1e({V:7.V,1o:u.17.S(7,7[7.h.3p()?"1U":"1M"])});j Y.1e({V:7.V,1o:7.46.S(7)});j Y.5s([j Y.3o(7.2K,{3n:1T,2u:0,2v:1}),j Y.44(7.3r,{3n:1T})],{V:7.V,1S:0.45,1o:f(){9(7.1C){7.1C.5r("12:7s")}}.S(7)});9(7.h.1P()){j Y.1e({V:7.V,1o:7.5q.S(7)})}},6l:f(){9(!7.12.3L()){z}j Y.5s([j Y.3o(7.3r,{3n:1T,2u:1,2v:0}),j Y.3o(7.2K,{3n:1T,2u:1,2v:0})],{V:7.V,1S:0.35});j Y.1e({V:7.V,1o:f(){7.1U.1x("").13();7.1M.1x("").13();7.4Y();7.3O.q({1z:7.1u.22.m+"r"})}.S(7)})},5p:f(){7.4i.13();7.1r.13();7.1I.13();7.3y.13();7.2E.13()},3c:f(){7.5p();9(!7.h.o.1F){7.2S={k:0,m:0};7.41=0;7.1F.13();z 2e}10{7.1F.17()}7.1F[(7.h.3J()?"6f":"1Z")+"7o"]("7m");9(7.h.1r||7.h.1I){7.4i.17()}9(7.h.1r){7.1r.1x(7.h.1r).17()}9(7.h.1I){7.1I.1x(7.h.1I).17()}9(7.1f&&7.1f.1V>1){7.3y.17().5f().1x(j 6y(7.o.7l).4W({1n:7.1n+1,7k:7.1f.1V}));9(7.o.2E.1K){7.2E.17();7.2G.17()}}7.5n();7.5m()},5n:f(){n E=7.1u.58.k,D=7.1u.4p.k,G=7.1u.56.k,A=7.1p?7.1p.k:7.1y.k,F=7j,C=0,B=7.o.7i;9(7.h.o.22){B=1m}10{9(!7.h.3p()){B="1B("+7.1l+"7h.26)";C=G}10{9(A>=F+E&&A<F+D){B="1B("+7.1l+"7f.26)";C=E}10{9(A>=F+D){B="1B("+7.1l+"7e.26)";C=D}}}}9(C>0){7.4s.q({k:C+"r"}).17()}10{7.4s.13()}9(B){7.4m.q({1O:B})}7.41=C},4z:f(){7.40=j Y.44(7.2L,{1S:0.3,2u:0,2v:1,V:7.V})},3h:f(){9(7.40){Y.2I.2M("12").1Z(7.40)}j Y.5k(7.2L,{1S:1,V:7.V})},5j:f(){9(!7.h.2D()){z}n D=(7.o.3j||7.1n!=0),B=(7.o.3j||(7.h.1P()&&7.2A().1t!=0));7.3g[D?"17":"13"]();7.3R[B?"17":"13"]();n C=7.1p||7.1y;7.1L.q({m:C.m+"r"});n A=((C.k/2-1)+7.1b).2V();9(D){7.1L.y(7.2z=j u("X",{U:"21 7d"}).q({k:A+"r"}));7.2z.3s="2Z"}9(B){7.1L.y(7.2w=j u("X",{U:"21 7c"}).q({k:A+"r"}));7.2w.3s="1t"}9(D||B){7.1L.17()}},5q:f(){9(!7.h.2D()){z}7.5j();7.1L.17()},46:f(){7.1L.1x("").13();7.3g.13().q({1v:7.1s.k+"r"});7.3R.13().q({1v:-1*7.1s.k+"r"})},6k:f(){9(7.12.1H("24")!=0){z}n A=f(){9(!W.14.2m){7.12.17()}7.12.1R(1)}.S(7);9(7.o.1D.1K){j Y.44(7.1D,{1S:0.4,2u:0,2v:7.4F?1:7.o.1D.24,V:7.V,7b:7.3Y.S(7),1o:A})}10{A()}},13:f(){9(W.14.2m){n A=$$("33#1Q")[0];9(A){3v{A.5L()}3u(B){}}}9(7.12.1H("24")==0){z}7.2q();7.1L.13();7.2K.13();9(Y.2I.2M("3X").7a.1V>0){z}Y.2I.2M("12").1j(f(C){C.4Z()});j Y.1e({V:7.V,1o:7.4l.S(7)});j Y.3o(7.12,{1S:0.1,2u:1,2v:0,V:{1n:"43",2T:"3X"}});j Y.5k(7.1D,{1S:0.4,V:{1n:"43",2T:"3X"},1o:7.5i.S(7)})},5i:f(){9(!W.14.2m){7.12.13()}10{7.12.q({1v:"-3l",1z:"-3l"})}7.2K.1R(0).17();7.1L.1x("").13();7.1U.1x("").13();7.1M.1x("").13();7.4K();7.5w();9(7.1C){7.1C.5r("12:3A")}7.4Y();7.1C=1m;7.1f=1m;7.h=1m;7.1p=1m},5m:f(){n B={},A=7[(7.1p?"5I":"i")+"5H"].k;7.1F.q({k:A+"r"});7.3B.q({k:A-7.41-1+"r"});B=7.3G(7.1F);7.1F.q({k:"7w%"});7.2S=7.h.o.1F?B:{k:B.k,m:0}},3b:f(){n B=7.12.2i();9(W.14.27){7.12.q({1c:"50%",1g:"50%"})}10{9(W.14.2m||W.14.2h){n A=19.2g.2i(),C=19.2g.5t();7.12.q({1v:0,1z:0,1g:(C[0]+(A.k/2)-(B.k/2)).2V()+"r",1c:(C[1]+(A.m/2)-(B.m/2)).2V()+"r"})}10{7.12.q({1n:"5A",1g:"50%",1c:"50%",1v:(0-B.k/2).2O()+"r",1z:(0-B.m/2).2O()+"r"})}}},5h:f(){7.2q();7.2N=1T;7.1t.S(7).2o(0.25);7.2G.q({1O:"1B("+7.1l+"76.26) 1c 1g 2C-2J"}).13()},2q:f(){9(7.2N){7.2N=2e}9(7.48){75(7.48)}7.2G.q({1O:"1B("+7.1l+"4c.26) 1c 1g 2C-2J"})},6N:f(){7[(7.2N?"4o":"4f")+"74"]()},5z:f(){9(7.2N){7.48=7.1t.S(7).2o(7.o.2E.2o)}},5P:f(){7.4b=[];n A=$$("a[72^=12]");A.1j(f(B){B.5N();j 1k.4N(B);B.18("2r",7.17.71(B).2l(f(E,D){D.4o();E(D)}).1h(7));9(B.1G.2D()){9(7.o.70){B.18("2c",7.5b.S(7,B.1G))}n C=A.6Z(f(D){z D.1i==B.1i});9(C[0].1V){7.4b.3t({1i:B.1G.1i,4M:C[0]});A=C[1]}}}.S(7))},4P:f(A){z 7.4b.6p(f(B){z B.1i==A})},4V:f(A){z 7.4P(A).4M.59("1G")},5M:f(){$(19.3P).18("2r",7.5W.1h(7));$w("2c 29").1j(f(C){7.1L.18(C,f(D){n E=D.57("X");9(!E){z}9(7.2z&&7.2z==E||7.2w&&7.2w==E){7.3w(D)}}.1h(7))}.S(7));7.1L.18("2r",f(D){n E=D.57("X");9(!E){z}n C=(7.2z&&7.2z==E)?"2s":(7.2w&&7.2w==E)?"1t":1m;9(C){7[C].2l(f(G,F){7.2q();G(F)}).S(7)()}}.1h(7));$w("2Z 1t").1j(f(C){7[C+"2x"].18("2c",7.3w.1h(7)).18("29",7.3w.1h(7)).18("2r",7[C=="1t"?C:"2s"].2l(f(E,D){7.2q();E(D)}).1h(7))}.S(7));n B=7.3Z.2Q("a.21");9(!W.14.2m){B.1j(f(C){C.18("2c",u.1R.S(7,C,7.o.3D.24.6X)).18("29",u.1R.S(7,C,7.o.3D.24.4k))}.S(7))}10{B.2W("1R",1)}7.4m.18("2r",7.13.1h(7));7.2G.18("2r",7.6N.1h(7));9(W.14.2m||W.14.2h){n A=f(D,C){9(7.12.1H("1c").3W(0)=="-"){z}D(C)};1e.18(1X,"3x",7.3b.2l(A).1h(7));1e.18(1X,"3S",7.3b.2l(A).1h(7))}9(W.14.2h){1e.18(1X,"3S",7.3Y.1h(7))}7.12.18("2c",7.30.1h(7)).18("29",7.30.1h(7));7.3O.18("2c",7.30.1h(7)).18("29",7.30.1h(7)).18("2r",7.13.1h(7))},30:f(C){n B=C.11;9(!7.h){B="29"}10{9(!(7.h&&7.h.o&&7.h.o.22&&(7.2K.6V()==1))){z}}9(7.3V){Y.2I.2M("54").1Z(7.3V)}n A={1z:((B=="2c")?0:7.1u.22.m)+"r"};7.3V=j Y.53(7.3O,{60:A,1S:0.2,V:{2T:"54",6a:1},2o:(B=="29"?0.3:0)})},67:f(){n A={};$w("k m").1j(f(E){n C=E.2y();n B=19.6U;A[E]=W.14.3k?[B["6T"+C],B["3x"+C]].6S():W.14.3i?19.3P["3x"+C]:B["3x"+C]});z A},3Y:f(){9(!W.14.2h){z}7.1D.q(7.1N(19.2g.2i()));7.1D.q(7.1N(7.67()))},5W:f(A){9(A.31&&(A.31==7.1D||A.31==7.4E||A.31==7.6m)){7.13()}},3w:f(E){n C=E.31,B=C.3s,A=7.1s.k,F=(E.11=="2c")?0:B=="2Z"?A:-1*A,D={1v:F+"r"};9(!7.34){7.34={}}9(7.34[B]){Y.2I.2M("65"+B).1Z(7.34[B])}7.34[B]=j Y.53(7[B+"2x"],{60:D,1S:0.2,V:{2T:"65"+B,6a:1},2o:(E.11=="29"?0.1:0)})},2A:f(){9(!7.1f){z}n D=7.1n,C=7.1f.1V;n B=(D<=0)?C-1:D-1,A=(D>=C-1)?0:D+1;z{2s:B,1t:A}},5l:f(F,G){n B=7.2F,E=7.1b,D=j u("6R",{2j:"6Q"+G,k:E+"r",m:E+"r"}),A={1c:(G.3W(0)=="t"),1g:(G.3W(1)=="l")};9(D&&D.4n&&D.4n("2d")){F.y(D);n C=D.4n("2d");C.6P=7.o.2k;C.6O((A.1g?B:E-B),(A.1c?B:E-B),B,0,9v.9u*2,1T);C.9t();C.6L((A.1g?B:0),0,E-B,E);C.6L(0,(A.1c?B:0),E,E-B)}10{F.y(j u("X").q({k:E+"r",m:E+"r",68:0,3K:0,1K:"6g",1n:"9p",9o:"3A"}).y(j u("v:9n",{9m:7.o.2k,9l:"9k",9j:7.o.2k,9i:(B/E*0.5).2P(2)}).q({k:2*E-1+"r",m:2*E-1+"r",1n:"3q",1g:(A.1g?0:(-1*E))+"r",1c:(A.1c?0:(-1*E))+"r"})))}},6n:f(){9(7.4A){z}$$("2Q","6H","33").2W("q",{2b:"3A"});7.4A=1T},5w:f(){$$("2Q","6H","33").2W("q",{2b:"3L"});7.4A=2e},1N:f(A){n B={};Z.6j(A).1j(f(C){B[C]=A[C]+"r"});z B},47:f(){z{k:7.1y.k,m:7.1y.m+7.2S.m}},5x:f(){n B=7.47(),A=2*7.1b;z{k:B.k+A,m:B.m+A}},5y:f(){n C=20,A=2*7.1s.m+C,B=19.2g.2i();z{k:B.k-A,m:B.m-A}}});Z.1d(1k,{5F:f(){7.3N=7.6E.1h(7);19.18("6D",7.3N)},4K:f(){9(7.3N){19.5N("6D",7.3N)}},6E:f(C){n B=9g.9d(C.6B).4R(),E=C.6B,F=7.h.1P()&&!7.4T,A=7.o.2E.1K,D;9(7.h.3p()){C.4o();D=(E==1e.6A||["x","c"].4S(B))?"13":(E==37&&F&&(7.o.3j||7.1n!=0))?"2s":(E==39&&F&&(7.o.3j||7.2A().1t!=0))?"1t":(B=="p"&&A&&7.h.1P())?"5h":(B=="s"&&A&&7.h.1P())?"2q":1m;9(B!="s"){7.2q()}}10{D=(E==1e.6A)?"13":1m}9(D){7[D]()}9(F){9(E==1e.96&&7.1f.6v()!=7.h){7.17(7.1f.6v())}9(E==1e.95&&7.1f.6t()!=7.h){7.17(7.1f.6t())}}}});Z.1d(1k,{6e:f(){9(7.1f.1V==0){z}n A=7.2A();7.4I([A.1t,A.2s])},4I:f(C){n A=(7.1f&&7.1f.4S(C)||Z.93(C))?7.1f:C.1i?7.4V(C.1i):1m;9(!A){z}n B=$A(Z.6i(C)?[C]:C.11?[A.1J(C)]:C).92();B.1j(f(F){n D=A[F],E=D.1a;9(D.3M||D.4J||!E){z}n G=j 2t();G.1w=f(){G.1w=W.23;D.4J=1m;7.6r(D,G)}.S(7);G.1q=E}.S(7))},6r:f(A,B){A.3M={k:B.k,m:B.m}},5b:f(A){9(A.3M||A.4J){z}7.4I(A)}});Z.1d(1k,{6q:f(A){n B;$w("2Y 3a 2a 2p").1j(f(C){9(j 6o("\\\\.("+7.90[C].2B(/\\s+/g,"|")+")(\\\\?.*)?","i").4r(A)){B=C}}.S(7));9(B){z B}9(A.4L("#")){z"3C"}9(19.6u&&19.6u!=(A).2B(/(^.*\\/\\/)|(:.*)|(\\/.*)/g,"")){z"2a"}z"3a"},6c:f(A){n B=A.8Y(/\\?.*/,"").3z(/\\.([^.]{3,4})$/);z B?B[1]:1m},4g:f(B){n C="<"+B.1A;8X(n A 5T B){9(!["32","4O","1A"].4S(A)){C+=" "+A+\'="\'+B[A]+\'"\'}}9(j 6o("^(?:8W|8V|8U|5o|8T|8S|8R|6b|8Q|8P|98|8N|28|8M|8L|9b)$","i").4r(B.1A)){C+="/>"}10{C+=">";9(B.32){B.32.1j(f(D){C+=7.4g(D)}.S(7))}9(B.4O){C+=B.4O}C+="</"+B.1A+">"}z C}});(f(){19.18("4t:4q",f(){n B=(2H.4U&&2H.4U.1V),A=f(D){n C=2e;9(B){C=($A(2H.4U).59("1Y").6G(",").1J(D)>=0)}10{3v{C=j 8J(D)}3u(E){}}z!!C};1X.1k.4Q=(B)?{2Y:A("9e 9f"),2p:A("4H")}:{2Y:A("6h.6h"),2p:A("4H.4H")}})})();1k.4N=8G.8F({8E:f(b){n c=Z.6F(b);9(c&&!b.1G){b.1G=7;9(b.1r){b.1G.4w=b.1r;9(1k.o.8C){b.1r=""}}}7.1a=c?b.8A("1a"):b.1a;9(7.1a.1J("#")>=0){7.1a=7.1a.66(7.1a.1J("#"))}9(b.1i&&b.1i.4L("36")){7.11="36";7.1i=b.1i}10{9(b.1i){7.11=b.1i;7.1i=b.1i}10{7.11=1k.6q(7.1a);7.1i=7.11}}$w("2R 2Y 36 2a 3a 3C 2p 1M 1U").1j(f(a){n T=a.2y(),t=a.4R();9("3a 36 1U 1M".1J(a)<0){7["8z"+T]=f(){z 7.11==t}.S(7)}}.S(7));9(c&&b.1G.4w){n d=b.1G.4w.8x(1k.o.9s).2W("8w");9(d[0]){7.1r=d[0]}9(d[1]){7.1I=d[1]}n e=d[2];7.o=(e&&Z.6C(e))?8t("({"+e+"})"):{}}10{7.1r=b.1r;7.1I=b.1I;7.o=b.o||{}}9(7.o.4C){7.o.2R=Z.3H(7.o.4C);5K 7.o.4C}},1P:f(){z 7.11.4L("36")},2D:f(){z(7.1P()||7.11=="3a")},3J:f(){z"2a 3C 2R".1J(7.11)>=0},3p:f(){z!7.3J()},9y:f(){z"2p".1J(7.11)>=-1}});1k.5e();19.18("4t:4q",1k.4f.S(1k));',62,593,'|||||||this||if||||||function||view||new|width||height|var|options||setStyle|px|||Element||||insert|return|||||||||||||||||||bind||className|queue|Prototype|div|Effect|Object|else|type|lightview|hide|Browser|||show|observe|document|href|border|top|extend|Event|views|left|bindAsEventListener|rel|each|Lightview|images|null|position|afterFinish|scaledInnerDimensions|src|title|sideDimensions|next|closeDimensions|marginLeft|onload|update|innerDimensions|marginTop|tag|url|element|overlay|li|menubar|_view|getStyle|caption|indexOf|display|prevnext|external|pixelClone|background|isGallery|lightviewContent|setOpacity|duration|true|media|length|break|window|name|remove||lv_Button|topclose|emptyFunction|opacity||jpg|IE6|param|mouseout|iframe|visibility|mouseover||false|case|viewport|Gecko|getDimensions|id|backgroundColor|wrap|WebKit419|value|delay|quicktime|stopSlideshow|click|previous|Image|from|to|nextButton|ButtonImage|capitalize|prevButton|getSurroundingIndexes|replace|no|isImage|slideshow|radius|slideshowButton|navigator|Queues|repeat|center|loading|get|sliding|round|toFixed|select|ajax|menuBarDimensions|scope|lightviewError|floor|invoke|ul|flash|prev|toggleTopClose|target|children|object|sideEffect||gallery||lv_Fill||image|restoreCenter|fillMenuBar|inlineMarker|inlineContent|afterEffect|prevButtonImage|stopLoading|WebKit|cyclic|IE|10000px|zIndex|sync|Opacity|isMedia|absolute|sideButtons|side|push|catch|try|toggleSideButton|scroll|imgNumber|match|hidden|data|inline|buttons|onComplete|resizeWithinViewport|getHiddenDimensions|clone|switch|isExternal|padding|visible|preloadedDimensions|keyboardEvent|topcloseButtonImage|body|png|nextButtonImage|resize|lv_Corner|lv_Wrapper|topCloseEffect|charAt|lightview_hide|maxOverlay|container|loadingEffect|closeButtonWidth|parseInt|end|Appear||hidePrevNext|getInnerDimensions|slideTimer|gif|userAgent|sets|slideshow_play|scale|controls|start|createHTML|convertVersionString|dataText|tagName|normal|restoreInlineContent|closeButton|getContext|stop|large|loaded|test|closeWrapper|dom|auto|autosize|_title|insertContent|fullscreen|startLoading|preventingOverlap|resizeCenter|ajaxOptions|pluginspage|topButtons|pngOverlay|pluginspages|QuickTime|preloadFromSet|isPreloading|disableKeyboardNavigation|startsWith|elements|View|html|getSet|Plugin|toLowerCase|member|resizing|plugins|getViews|evaluate|require|clearContent|cancel||prepare|mac|Morph|lightview_topCloseEffect|Scriptaculous|innertop|findElement|small|pluck|sizingMethod|preloadImageHover|prevSide|DXImageTransform|load|down|isMac|startSlideshow|afterHide|setPrevNext|Fade|createCorner|setMenuBarDimensions|setCloseButtons|br|hideData|showPrevNext|fire|Parallel|getScrollOffsets|transition|_|showOverlapping|getOuterDimensions|getBounds|nextSlide|fixed|showContent|finishShow|isIframe|isAjax|enableKeyboardNavigation|afterShow|nnerDimensions|scaledI|adjustDimensionsToView|delete|Stop|addObservers|stopObserving|AlphaImageLoader|updateViews|Microsoft|progid|build|in|SetControllerVisible|isQuicktime|bodyClick|REQUIRED_|mimetypes|loop|style|filter|autoplay|default|before|lightview_side|substr|getScrollDimensions|margin|scrolling|limit|img|detectExtension|lv_WrapDown|preloadSurroundingImages|add|block|ShockwaveFlash|isNumber|keys|appear|hideContent|loadingButton|hideOverlapping|RegExp|find|detectType|setPreloadedDimensions|lv_Frame|last|domain|first|namespaces|lv_CornerWrapper|Template|lv_Half|KEY_ESC|keyCode|isString|keydown|keyboardDown|isElement|join|embed|marginRight|_inlineDisplayRestore|lv_Filler|fillRect|nextSide|toggleSlideshow|arc|fillStyle|corner|canvas|max|offset|documentElement|getOpacity|close_|hover|lv_PrevSide|partition|preloadHover|curry|class|lv_Sides|Slideshow|clearTimeout|slideshow_stop|float|right|lv_Container|effects|beforeStart|lv_NextButton|lv_PrevButton|close_large|close_small|addClassName|close_innertop|borderColor|180|total|imgNumberTemplate|lv_MenuTop|bl|ClassName|tr|tl|times|opened|resizeDuration|Tween|blank|100|isInline|lv_PrevNext|cloneNode|frames|lv_FrameBottom|parentNode|innerHTML|lv_Loading|clientHeight|clientWidth|lv_External|requires|ancestors|throw|flashvars|FlashVars|movie|high|quality|lv_Slideshow|classids|classid|codebases|codebase|lv_ImgNumber|enablejavascript|controller|lv_Caption|Version|REQUIRED_Scriptaculous|tofit|lv_Title|VML|lv_DataText|lv_Data|wrapperTag|behavior|hspace|addRule|frameBorder|Updater|createStyleSheet|undefined|Ajax|lv_Close|lv_MenuBar|lv_Media|vml|typeof|galleryimg|alt|lv_WrapCenter|com|lv_WrapUp|microsoft|150|lv_Center|schemas|eval|defaultOptions|urn|strip|split|lv_HalfRight|is|getAttribute|required|removeTitles|plugin|initialize|create|Class|REQUIRED_Prototype|requiresPlugin|ActiveXObject|errors|spacer|range|meta|lv_HalfLeft|link|input|hr|frame|col|basefont|base|area|for|gsub|lv_Liquid|typeExtensions|lv_FrameTop|uniq|isArray|lv_Frames|KEY_END|KEY_HOME|lv_topcloseButtonImage|isindex|script|blur|wbr|lv_topButtons|fromCharCode|Shockwave|Flash|String|head|arcSize|strokeColor|1px|strokeWeight|fillcolor|roundrect|overflow|relative|after|lv_NextSide|titleSplit|fill|PI|Math|js|MSIE|isVideo'.split('|'),0,{}));

function showBox(id){
    element = $(id);
	if (!element) {
		
		Lightview.show({
		  href: site_url+'/information/viewAjax/'+id,
		  rel: 'ajax',
		  options: {
		    autosize: true,
		    topclose: true,
		    ajax: {
		      method: 'post',
		      onSuccess: function(transport){
		      var response = transport.responseText;
				/*alert(response);*/
		      }
			}
		  }
		});	
	} else {
	Lightview.show({href:'#'+id,options: true});
	Field.focus('username');
	}
}

function showUrl(url){
		Lightview.show({
		  href: site_url+url,
		  rel: 'ajax',
		  options: {
		    autosize: true,
		    topclose: true,
		    ajax: {
		      method: 'post',
		      onSuccess: function(transport){
		      var response = transport.responseText;
				/*alert(response);*/
		      }
			}
		  }
		});	
}

//init obj
if(typeof cpUpdater === "undefined" || !cpUpdater) {
	var cpUpdater = {
		savingMsg: "Saving ..."
	};
}

// vars
cpUpdater.reaction_updater_id = new Array();
for(var i = 0; i < cans.length; i++){
	cpUpdater.reaction_updater_id[i] = false;
	
}	
cpUpdater.current_question_updater_id = false;
cpUpdater.active_participant_updater_id = false;
cpUpdater.current_question_last_value = false;
cpUpdater.current_question_id = 0;
cpUpdater.current_tab_name = false;
cpUpdater.sliders = new Object;
ajaxOn = true;
var sort = 'pending';

cpUpdater.vote = function(url) {
	my_loading_reminder.show();
	new Ajax.Request(url, {
		onSuccess: function(transport) {
			my_loading_reminder.hide();
			lazy_loader.refreshView();
		}
	});
}

cpUpdater.cpUpdate = function(stream_update,respondents) {
	updaters = new Array();
	last_respondent_current = "start";
	last_respondent_question_id = false;
	if(stream_update){
		if (respondents) {
			// Changes the overall reaction field
			for(var i = 0; i < cans.length; i++){
				cpUpdater.ajaxReaction(cans[i]);  // Initial call
				cpUpdater.reaction_updater_id[i] = setInterval('cpUpdater.ajaxReaction('+cans[i]+')', 10000);	// Ten Seconds
			}
			
			// Switches the current question when necessary
			cpUpdater.ajaxCurrentQuestion();
			cpUpdater.current_question_updater_id = setInterval('cpUpdater.ajaxCurrentQuestion()', 10000);		// Ten Seconds
			
			// Starts the active user pinging, this does not get stopped when disable ajax is called 
			cpUpdater.ajaxParticipantPing();
			cpUpdater.active_participant_updater_id = setInterval('cpUpdater.ajaxParticipantPing()', 60000);	// One Minute, 30 Seconds
			
			if(cpUpdater.is_respondent){
				// Update sliders for new question
				cpUpdater.ajaxRespondentStatus();
				setInterval('cpUpdater.ajaxRespondentStatus()', 10000);
			}else{
				// Update sliders for new question
				cpUpdater.ajaxParticipant();
				setInterval('cpUpdater.ajaxParticipant()', 10000);
			}
		}//end if respondents 
				
		// Switches the current question when necessary
		cpUpdater.ajaxCurrentQuestion();
		cpUpdater.current_question_updater_id = setInterval('cpUpdater.ajaxCurrentQuestion()', 10000);		// Ten Seconds
		
	}
}

// Used above as part of the interval call
cpUpdater.ajaxReaction = function(speaker_id){
	new Ajax.Request(site_url + 'forums/ajax_get_respondent_info/'+ event_name +'/'+speaker_id, {
	  onSuccess: function(transport) {
		eval('var response = '+transport.responseText);
		if(!cpUpdater.is_respondent){
			// Change the rating bar
			$('overall-reaction-meter-'+speaker_id).setStyle(
				{
					width: response.reaction
				}
			);
		}
		// Change the class if current user
		if(response.selected == '1'){
			$$('.sp_arrow_selected').invoke('removeClassName', 'sp_arrow_selected');
			$('current_area_'+speaker_id).addClassName('sp_arrow_selected');
		}
		
	  }
	});
}

// Used above as part of the interval call, this checks to see if there is a new question, and will only show the new question if there is.  
// This is done for efficiency.
cpUpdater.ajaxCurrentQuestion = function(speaker_id,respondent){
	new Ajax.Request(site_url + 'forums/ajax_get_current_question/'+ event_name, {
		onSuccess: function(transport) {
			if(transport.responseText != cpUpdater.current_question_last_value){
				if(transport.responseText != 'none'){
					cpUpdater.ajaxUpdateCurrentQuestion(transport.responseText,respondent);
					cpUpdater.current_question_last_value = transport.responseText;
				}else{
					$('current_question').innerHTML = "&nbsp;Waiting for a current question.";
				}
				
			}
	  	}
	});
}
// used with the above function, it will actually display the new current question
cpUpdater.ajaxUpdateCurrentQuestion = function(new_question_id,respondent){
	// Get New Current Question
	new Ajax.Request(site_url + 'forums/ajax_get_current_question/'+ event_name+'/pod', {
		onSuccess: function(transport) {
			$('current_question').setStyle({visibility: "hidden"});
			$('current_question').innerHTML = transport.responseText;
			$('the-current-question').setStyle({backgroundColor: "#FFFFFF"});
			$('current_question').setStyle({visibility: "visible"});
			new Effect.Highlight('the-current-question', {startcolor: '#ffffff', endcolor: '#F2F6FE', duration: 1.5});
			$('the-current-question').setStyle({backgroundColor: "#F2F6FE"});
	  	}
	});
	if(!cpUpdater.is_respondent && respondent){
		// Update sliders for new question
		new Ajax.Request(site_url + 'forums/ajax_get_slider_info/'+ event_name+'/'+new_question_id);
	}
	
}

cpUpdater.ajaxParticipantPing = function(){
	new Ajax.Request(site_url + 'forums/ajax_user_ping/'+ event_id + '/' + user_id, {
		onSuccess: function(transport) {
			//console.log(transport.responseText);
	  	}
	});
}

cpUpdater.ajaxRespondentStatus = function(){
	new Ajax.Request(site_url + 'forums/ajax_respondent_status/'+ event_id + '/' + user_id, {
		onSuccess: function(transport) {
			eval('var response = '+transport.responseText);
			
			if(last_respondent_current != response.current_responder || last_respondent_question_id != response.current_id){
				cpUpdater.ajaxChangeRespondentStatus(transport.responseText);
				last_respondent_current = response.current_responder;
				last_respondent_question_id = response.current_id;
			}
			if(parseInt(response.unanswered_percent) >= 75){
				$('respondent_unanswered_meter').addClassName('overall-reaction-meter-green');
				$('respondent_unanswered_meter').removeClassName('overall-reaction-meter-yellow');
				$('respondent_unanswered_meter').removeClassName('overall-reaction-meter');
			}else if(parseInt(response.unanswered_percent) >= 50){
				$('respondent_unanswered_meter').addClassName('overall-reaction-meter-yellow');
				$('respondent_unanswered_meter').removeClassName('overall-reaction-meter');
				$('respondent_unanswered_meter').removeClassName('overall-reaction-meter-green');
			}else{
				$('respondent_unanswered_meter').addClassName('overall-reaction-meter');
				$('respondent_unanswered_meter').removeClassName('overall-reaction-meter-yellow');
				$('respondent_unanswered_meter').removeClassName('overall-reaction-meter-green');
			}
			if(response.unanswered_percent){
				$('respondent_unanswered_meter').setStyle({
					width: response.unanswered_percent+"%"
				});
			}
	  	}
	});
}

cpUpdater.ajaxChangeRespondentStatus = function(){
	new Ajax.Request(site_url + 'forums/ajax_respondent_status/'+ event_id + '/' + user_id + '/1', {
		onSuccess: function(transport) {
			$('respondent_div').innerHTML = transport.responseText;
	  	}
	});
}

cpUpdater.ajaxRespondentAction = function(action){
	new Ajax.Request(site_url+'forums/ajax_response_change/'+ event_id + '/' + user_id + '/'+action,  { 
		onSuccess: function(transport){    
			cpUpdater.ajaxChangeRespondentStatus();
		} 
	});
}

cpUpdater.ajaxParticipant = function(){
	new Ajax.Request(site_url + 'forums/ajax_participant/'+ event_id, {
		onSuccess: function(transport) {
			$('user_reaction_ajax').innerHTML = transport.responseText;
	  	}
	});
}

cpUpdater.ajaxParticipantVote = function(type){
	new Ajax.Request(site_url + 'forums/ajax_participant_vote/'+ event_id+'/'+user_id+'/'+type, {
		onSuccess: function(transport) {
			cpUpdater.ajaxParticipant();
	  	}
	});
}

cpUpdater.askQuestion = function() {
	form = $('add_question_form');
	
	new Ajax.Request(site_url + 'question/add/event/' + event_name, {
		parameters: {
			'event'		: $F(form['event']),
			'question'	: $F(form['question']),
			'desc'		: $F(form['desc']),
			'tags'		: $F(form['tags']),
			'ajax'		: 'true'
		},
		onSuccess: function(transport) {
			if(transport.responseText=='success') {
				form['question'].clear();
				form['desc'].clear();
				form['tags'].clear();
				new Effect.toggle('cp-ask-question','blind', {queue: 'end'});
			} else {
				$('cp-ask-question').innerHTML = transport.responseText;
				new Effect.ScrollTo($('top_lock'),{offset:-75});
			}
		}
	});
	cpUpdater.cpUpdate(true);
	ajaxOn = true;
	cpUpdater.startLazyLoader();
}

cpUpdater.disableAJAX = function() {
	if(lazy_loader.update && ajaxOn) {
		lazy_loader.stopUpdating();
		ajaxOn=false; 
		updaters.each(function(s) {
			s.stop();
		});
		
		for(var i = 0; i < cans.length; i++){
			clearInterval(cpUpdater.reaction_updater_id[i]);
			cpUpdater.reaction_updater_id[i] = false;
		}
		
		clearInterval(cpUpdater.current_question_updater_id);
		cpUpdater.current_question_updater_id = false;
	}	
}

cpUpdater.enableAJAX = function() {
	if(!lazy_loader.update && !ajaxOn) {
		lazy_loader.startUpdating();
		ajaxOn=true; 
		updaters.each(function(s) {
			s.start();
		});
		
		for(var i = 0; i < cans.length; i++){
			if(!cpUpdater.reaction_updater_id[i]){
				cpUpdater.ajaxReaction(cans[i]);  // Initial call
				cpUpdater.reaction_updater_id[i] = setInterval('cpUpdater.ajaxReaction('+cans[i]+')', 10000);
			}
		
		}
		
		if(!cpUpdater.current_question_updater_id){
			cpUpdater.ajaxCurrentQuestion();
			cpUpdater.current_question_updater_id = setInterval('cpUpdater.ajaxCurrentQuestion()', 10000);
		}
	}	
}

//function for going to the next question
cpUpdater.nextQuestion = function(id) {
	var button = $('next_question');
	button.value='Advancing Question!';
	button.disabled=true;
	button.setStyle('background-color:#444;');
	my_loading_reminder.show();
	new Ajax.Request(site_url+'forums/next_question/'+id,  { 
		onSuccess: function(transport){  
			setTimeout("$('next_question').value='Goto The Next Question';",5000);
			setTimeout("$('next_question').disabled=false;",5000);
			setTimeout("$('next_question').setStyle('background-color:#0055A4;')",5000);			
		}, 
		onFailure: function(){ 
			button.value='Could not change question. Please Refresh Page!';
			button.setStyle('background-color:#FF0000');
		} });
	cpUpdater.cpUpdate(true);
	ajaxOn = true;
	my_loading_reminder.hide();
	cpUpdater.startLazyLoader();
}

cpUpdater.deleteQuestion = function (question_id) {
	my_loading_reminder.show();
	new Ajax.Request(site_url+'forums/DeleteQuestion/'+question_id, {
		method: 'get',onSuccess : cpUpdater.UpdateQuestionOnSucess 
	});
	my_loading_reminder.hide();
	cpUpdater.startLazyLoader();
}

cpUpdater.view_tab_section = function(tab_name, question_id, option_1, option_2){
	if(question_id != cpUpdater.current_question_id){
		$$('div[class=cp-comments]').invoke('setStyle', {display:'none'});
	}
	

	if(tab_name == cpUpdater.current_tab_name && question_id == cpUpdater.current_question_id) {	
		$("cp_tab_body_"+question_id).setStyle({display:'none'});
		cpUpdater.toggleAJAX();					// turns off ajax calls
		cpUpdater.current_tab_name = false;
		cpUpdater.current_question_id = false;
		$("cp_"+tab_name+"_tab_"+question_id).removeClassName(tab_name+"_on");
		
	} else {
		my_loading_reminder.show();
		if(tab_name == "comments"){
			url = site_url + 'question/view/' + option_1 + '/' + option_2;  			// option 1 is event name, 2 is question name
		}else if(tab_name == "votes"){
			url = site_url + 'votes/who/' + question_id;							
		}else if(tab_name == "info"){
			url = site_url + 'forums/get_question_info/' + question_id;
		}else if(tab_name == "admin"){
			url = site_url + 'forums/EditQuestion/' + question_id + '/' + option_1;		// option 1 is event id
		}else if(tab_name == 'answer'){
			url = site_url + 'forums/ShowAnswer/' + question_id
		}
		
		new Ajax.Updater('cp_tab_body_' + question_id, url, {
			parameters: {
				'ajax' : 'true'
			},
			onSuccess: function(transport) {
				$("cp_tab_body_"+question_id).setStyle({display:'block'});
				cpUpdater.toggleAJAX();			// turns off ajax calls
				my_loading_reminder.hide();
				$("cp_"+tab_name+"_tab_"+question_id).addClassName(tab_name+"_on");
				if(cpUpdater.current_tab_name){
					$("cp_"+cpUpdater.current_tab_name+"_tab_"+cpUpdater.current_question_id).removeClassName(cpUpdater.current_tab_name+"_on");
				}
				cpUpdater.current_tab_name = tab_name;
				cpUpdater.current_question_id = question_id;
				// Scroll to it if required
				setTimeout(function() { 
					if($("cp_"+tab_name+"_tab_"+question_id).cumulativeOffset()[1] > document.viewport.getScrollOffsets()[1]+document.viewport.getHeight() ){
						new Effect.ScrollTo("cp_"+tab_name+"_tab_"+question_id, { offset: -(document.viewport.getHeight())+25 }); 
					}
				}, 500); 
			}
		});
	}
}

cpUpdater.change_comments_sort = function(question_id, event_name, question_name, sort) {
	my_loading_reminder.show();
	new Ajax.Updater('cp-comments-' + question_id, site_url + 'question/view/' + event_name + '/' + question_name + '/' + sort, {
		parameters: {
			'ajax' : 'true'
		},
		onSuccess: function(transport) {
			new Ajax.Updater('cp_tab_body_' + question_id, site_url + 'question/view/' + event_name + '/' + question_name, {
				parameters: {
					'ajax' : 'true'
				}
			});
			my_loading_reminder.hide();
		}
	});
}

cpUpdater.voteComment = function (url, question_id, event_name, question_name) {
	new Ajax.Request(url, {
		onSuccess: function(transport) {
			new Ajax.Updater('cp_tab_body_' + question_id, site_url + 'question/view/' + event_name + '/' + question_name, {
				parameters: {
					'ajax' : 'true'
				}
			});
		}
	});
}

cpUpdater.submitComment = function(question_id, event_name, question_name, parent_id) {
	// form = $('commenting_form_' + question_id);
	if(parent_id > 0) {
		form = $('subcommenting_form_' + parent_id);
	} else {
		form = $('commenting_form_' + question_id);
	}
	
	new Ajax.Request(site_url + 'comment/addCommentAction/', {
		parameters: {
			'parent_id'			: parent_id,
			'comment'			: $F(form['comment']),
			'fk_question_id'	: question_id,
			'event_name'		: $F(form['event_name']),
			'name'				: $F(form['name']),
			'event_type'		: $F(form['event_type']),
			'ajax'				: 'true'
		},
		onSuccess: function(transport) {
			new Ajax.Updater('cp_tab_body_' + question_id, site_url + 'question/view/' + event_name + '/' + question_name, {
				parameters: {
					'ajax' : 'true'
				}
			});
		}
	});
}

cpUpdater.toggleNewQuestion = function(){
	if(!lazy_loader.update){ 
		$$('div[class=cp-comments]').invoke('setStyle', {display:'none'});
		cpUpdater.toggleAJAX();	 
	}
	new Effect.toggle('cp-ask-question','blind', {queue: 'end'});
}

cpUpdater.toggleAJAX = function () {
	if(lazy_loader.update && ajaxOn) { 
		cpUpdater.disableAJAX(); 
	} else if ($$('div[class=cp-comments]').collect(function(n){ return n.getStyle('display'); }).indexOf('block') == -1) { 
		cpUpdater.enableAJAX(); 
	}
}

cpUpdater.current_question_fade = function() {
	new Effect.Highlight('the-current-question', {startcolor: '#ffffff', endcolor: '#F2F6FE', duration: 1.5});
	// timer = setInterval('ColorChange()', 75);
}

cpUpdater.change_sort = function(_sort) {
	sort = _sort;
	
	sort_links = new Array();
	// Event_timing defined in main.php, this needs to be a member variable when made a class
	
	// Change the question title
	if(sort == 'pending'){
		if(event_timing == 'past'){
			$('question_title').innerHTML = "Unanswered Questions";
		}else{
			$('question_title').innerHTML = "Upcoming Questions";
		}
	}else if(sort == 'newest'){
		$('question_title').innerHTML = "Newest Questions";
	}else if(sort == 'deleted'){
		$('question_title').innerHTML = "Deleted Questions";
	}else{
		$('question_title').innerHTML = "Answered Questions";
	}
	// Change the highlights
	if(event_timing == 'past'){
		sort_links = ['pending', 'asked', 'deleted'];
	}else{
		sort_links = ['pending', 'newest', 'asked', 'deleted'];
	}
	sort_links.without(_sort).each(function(s) {
		if ($('sort-link-' + s)) {
		if($('sort-link-' + s).hasClassName('cp-sort-link-selected')) {
			$('sort-link-' + s).removeClassName('cp-sort-link-selected');
			$('sort-link-' + s).addClassName('cp-sort-link');
		}}
	});

	if($('sort-link-' + _sort).hasClassName('cp-sort-link')) {
		$('sort-link-' + _sort).removeClassName('cp-sort-link');
		$('sort-link-' + _sort).addClassName('cp-sort-link-selected');
	}
	
	ajax_update_url = site_url + 'forums/cp/' + event_name + '/upcoming_questions/' + sort;
	ajax_count_url = site_url + 'forums/cp/' + event_name + '/upcoming_questions_count';
	
	lazy_loader.reset(ajax_update_url, ajax_count_url);
	
	// Should this be here?????
	updaters.each(function(s) { s.stop(); });
	cpUpdater.cpUpdate();
	ajaxOn = true;
}

cpUpdater.startLazyLoader = function() {
	lazy_loader = new Control.LazyLoader('upcoming_questions', upcoming_questions_url, upcoming_questions_count_url, {
		count_refresh_lapse: 100000, 
		view_refresh_lapse: 10000,
		onStartAddSection: function() { 
			my_loading_reminder.show(); 
		}, 
		onFinishAddSection: function() { 
			my_loading_reminder.hide(); 
		}
	});
}
// ==================================================================================
// = ChangeQuestionStatus - Used as admin to change show or hide the asked box only =
// ==================================================================================
cpUpdater.ChangeQuestionStatus = function(elem) {
	if(elem.value == 'asked' || elem.value == 'current'){
		$('question_status_div').setStyle({ display : 'block' });
	}else{
		$('question_status_div').setStyle({ display : 'none' });
	}
	if(elem.value == 'deleted'){
		$('question_delete_div').setStyle({ display : 'block' });
	}else{
		$('question_delete_div').setStyle({ display : 'none' });
	}
}
// ==================================================================================
// = ChangeDeleteReason - Used as admin to change show or hide the asked box only =
// ==================================================================================
cpUpdater.ChangeDeleteReason = function(elem) {
	if(elem.value == 'other'){
		$('delete_reason_other_div').setStyle({ display : 'block' });
	}else{
		$('delete_reason_other_div').setStyle({ display : 'none' });
	}
}
// ==================================================================================
// = UpdateQuestionOnSucess - Call Back function when updating a question		    =
// ==================================================================================
cpUpdater.UpdateQuestionOnSucess = function(transport) { 
	if(transport.responseText){
		$('question_error_div').innerHTML = "Updated Successfully!";
		eval('var response = '+transport.responseText);
		setTimeout('cpUpdater.view_tab_section("admin", '+response.question_id+', '+response.event_id+')', 2000);
		
		// ROB put this in before, I don't know if it's needed so I'm commenting it out for now - CTE
		// Change the highlights
		// if(event_timing == 'past'){
		// 			sort_links = ['pending', 'asked'];
		// 		}else{
		// 			sort_links = ['pending', 'newest', 'asked'];
		// 		}
		// 
		// 		sort_links.each(function(s){
		// 			if( $('sort-link-'+ s + '-2').hasClassName('cp-sort-link-selected') ){
		// 				setTimeout("cpUpdater.change_sort('"+s+"')",  1500);
		// 			}
		// 		});
		
		
	}else{
		$('question_error_div').innerHTML = "Could not update!";
	}
	
}

// ===============
// = Lazy Loader Class =
// ===============
//
//
if(!Control) var Control = {};
Control.LazyLoader = Class.create();

Control.LazyLoader.prototype = {
	initialize: function (container_elem_id, ajax_update_url, ajax_count_url, options){
		this.container_elem_id = container_elem_id;
		this.ajax_update_url = ajax_update_url;
		this.item_count = 0;
		this.ajax_count_url = ajax_count_url;
		this.segment_divs = new Array();
		this.segment_divs_last_refresh = new Array();
		this.segment_divs_view_range = new Array();
		this.update = true;		// Starts true, is used to stop all updating
		this.update_on_scroll = false;
		
		
		
		// We have a lot of defaults that we use if not defined
		this.options = Object.extend({
			items_per_section : 10,
			onStartAddSection : false,
			onFinishAddSection : false,
			count_refresh_lapse: 100000,		// Default is every minute
			view_refresh_lapse: 100000			// Default is every minute
		}, options || {});
		
		// Add Content, first temp then real content added on the callback from the CheckCount() call below
		this.init_populate_complete = false;
		this.checkCount();		// For the initial count, because of the variable above it actually populates the container initially too
		
		// Assign Events, the observes are added after the initial population (IE thing)
		this.addSegmentsOnEventEvent = this.addSegmentsOnEvent.bind(this, "scroll");
		this.refreshExistingSegmentsOnScrollEvent = this.refreshExistingSegmentsOnScroll.bind(this);

		// Start the periodic count	check
		this.checkCountHandle = setInterval(this.checkCount.bind(this), this.options.count_refresh_lapse);
		this.checkRefreshHandle = setInterval(this.refreshView.bind(this), this.options.view_refresh_lapse);
	},
	refreshExistingSegmentsOnScroll : function(){
		if(this.update){
			// Refresh segments that come into the current view due to scrolling that have already been added.
			var within_range = this.getViewportWithinRange();		
			if(within_range[0] < this.segment_divs_view_range[0]){
				this.refreshSection(within_range[0], true);
			}else if(within_range[1] > this.segment_divs_view_range[1]){
				this.refreshSection(within_range[1], true);
			}
			this.segment_divs_view_range = within_range;
		}
	},
	addSegmentsOnEvent : function(call_source){
		
		//console.log("addSegmentsOnEvent");
		if(this.update){
			// Add More divs if necessary
			var scrolled_pos = document.viewport.getScrollOffsets()[1] + document.viewport.getDimensions().height;
			if(((this.segment_divs.length) * this.options.items_per_section) < this.item_count){
				// find out where the lowest div is
				var abs_div_pos = Position.cumulativeOffset($(this.segment_divs[(this.segment_divs.length - 1)]));
				var bottom_div_height = $(this.segment_divs[(this.segment_divs.length - 1)]).getHeight();
				var bottom_div_max = bottom_div_height + abs_div_pos[1];
				var bottom_div_half_height = (bottom_div_height / 2);
				// If we have scrolled past the last half of the last div then add segment
				if(scrolled_pos+bottom_div_half_height > bottom_div_max){			
					this.addNewSegment(call_source);	
					return;
				}
			}
			// This part should only be reached if it's not adding a section and it's on a callback from previously adding a section
			if(this.options.onFinishAddSection && call_source == "callback"){
				this.options.onFinishAddSection();
			}
			if(call_source == 'callback' && !this.init_populate_complete){
				//console.log('Population Complete, add the events');
				this.init_populate_complete = true;		// The initial population is complete so we can add the onscroll events
				
				Event.observe(window, 'scroll', this.addSegmentsOnEventEvent);
				Event.observe(window, 'resize', this.addSegmentsOnEventEvent);
				Event.observe(window, 'scroll', this.refreshExistingSegmentsOnScrollEvent);
				Event.observe(window, 'resize', this.refreshExistingSegmentsOnScrollEvent);
			}
		}
	},
	addNewSegment : function(original_call_source){
		if(original_call_source == 'scroll' && this.options.onStartAddSection){
			this.options.onStartAddSection();
		}
		
		this.segment_divs[this.segment_divs.length] = document.createElement('div');
		$(this.container_elem_id).appendChild(this.segment_divs[(this.segment_divs.length - 1)]);
		var date = new Date();
		var timestamp = date.getTime();
		new Ajax.Updater($(this.segment_divs[(this.segment_divs.length - 1)]), this.ajax_update_url+'/'+(this.segment_divs.length - 1)+'/'+timestamp, { method: 'post', onComplete : this.addNewSegmentOnComplete.bind(this) });
		// Set a time stamp for this section so it can be refreshed accordingly
		var now=new Date()
		var h=now.getHours() * 60;
		var m=(now.getMinutes() + h) * 60;
		var s=now.getSeconds() + m;
		this.segment_divs_last_refresh[(this.segment_divs.length - 1)] = s;
	},
	addNewSegmentOnComplete : function(){
		this.addSegmentsOnEvent("callback");
	},
	stopUpdating : function(){
		clearTimeout(this.checkCountHandle);
		clearTimeout(this.checkRefreshHandle);
		this.update = false;
	},
	startUpdating : function(do_not_update_first){
		if(!do_not_update_first){
			// Update immediatley first
			this.checkCount();
			this.refreshView();
		}
		// start the interval
		this.checkCountHandle = setInterval(this.checkCount.bind(this), this.options.count_refresh_lapse);
		this.checkRefreshHandle = setInterval(this.refreshView.bind(this), this.options.view_refresh_lapse);
		// let the class know we mean it!
		this.update = true;
	},
	reset : function(ajax_update_url, ajax_count_url){
		this.ajax_update_url = ajax_update_url;
		this.item_count = 0;
		this.ajax_count_url = ajax_count_url;
		
		this. stopUpdating();
		Event.stopObserving(window, 'scroll', this.addSegmentsOnEventEvent);
		Event.stopObserving(window, 'resize', this.addSegmentsOnEventEvent);
		Event.stopObserving(window, 'scroll', this.refreshExistingSegmentsOnScrollEvent);
		Event.stopObserving(window, 'resize', this.refreshExistingSegmentsOnScrollEvent);
		
		// remove existing divs
		for(var i = 0; i < this.segment_divs.length; i++){
			$(this.container_elem_id).removeChild(this.segment_divs[i]);
		}
		
		this.segment_divs = new Array();
		this.segment_divs_last_refresh = new Array();
		this.segment_divs_view_range = new Array();
		
		// Add Content, first temp then real content added on the callback from the CheckCount() call below
		this.init_populate_complete = false;
		this.checkCount();		// For the initial count, because of the variable above it actually populates the container initially too
		
		this.startUpdating(true);
	},
	// CHECK COUNT FUNCTIONS, on initial call it calls the first portion to fill in the page.  We must have the count before we can do this!
	checkCount : function(){
		if(!this.init_populate_complete && this.options.onStartAddSection){
			this.options.onStartAddSection();
		}
		var date = new Date();
		var timestamp = date.getTime();
		new Ajax.Request(this.ajax_count_url+'/'+timestamp,
		  {
		    onSuccess: this.checkCountOnSuccessCallback.bind(this)
		  });
	},
	checkCountOnSuccessCallback : function(transport){
		this.item_count = transport.responseText;
		if(!this.init_populate_complete){
			$(this.container_elem_id).innerHTML = "";
			this.addNewSegment();	//console.log("Initial population call");
			
		}
		
	},
	// REFRESH FUNCTIONS
	refreshView : function(){
		for(var i = this.segment_divs_view_range[0]; i <= this.segment_divs_view_range[1]; i++){
			this.refreshSection(i, false);
		}
	},
	// Actual part where the view is refreshed.  This is used in two separate places which explains why it is it's own functions
	refreshSection : function(section_num, time_check){
		if(time_check){
			var now=new Date();
			var h=now.getHours() * 60;
			var m=(now.getMinutes() + h) * 60;
			var s=now.getSeconds() + m;
			
			// If checking is on (scrolling down and entering new section) then check to see if we should refresh, we don't want to refresh
			// every time the user scrolls over a new section or it could amount to far too much loading.			
			if(s < (this.segment_divs_last_refresh[section_num] + this.options.view_refresh_lapse * 0.001)){
				return;
			}
		}
		var date = new Date();
		var timestamp = date.getTime();
		new Ajax.Updater($(this.segment_divs[section_num]), this.ajax_update_url+'/'+section_num+'/'+timestamp, { method: 'post'});
		// Set a time stamp for this section so it can be refreshed accordingly
		var now=new Date();
		var h=now.getHours() * 60;
		var m=(now.getMinutes() + h) * 60;
		var s=now.getSeconds() + m;
		this.segment_divs_last_refresh[section_num] = s;
		//console.log('Refreshing Section '+section_num+" Timestamp at: "+this.segment_divs_last_refresh[section_num]);
	},
	// HELPER FUNCTIONS
	getViewportWithinRange : function(){
		// First find out where we are scrolled on the page
		var viewport_height = document.viewport.getDimensions().height;
		var scrolled = document.viewport.getScrollOffsets();
		// Find out which divs are in the current view
		var min = scrolled[1];
		var max = min + viewport_height;
		var current_div_iteration = 0;
		var return_array = new Array();
		// First find with div the min is in
		if(min < Position.cumulativeOffset($(this.segment_divs[0]))[1] ){
			return_array[0] = '0';
		}else{
			for(var i = 0; i < this.segment_divs.length; i++){
				var current_div_pos = Position.cumulativeOffset($(this.segment_divs[i]));
				var current_div_bottom = current_div_pos[1] + $(this.segment_divs[i]).getHeight();
				if((min >= current_div_pos[1] && min <= current_div_bottom)){
					//console.log("Section "+i+" is in the current view");
					return_array[0] = i;
					current_div_iteration = i;
					break;
				}
			}
		}
		
		// Then find with di the max is in
		if(max >= (Position.cumulativeOffset($(this.segment_divs[(this.segment_divs.length - 1)]))[1]+ $(this.segment_divs[(this.segment_divs.length - 1)]).getHeight()) ){
			return_array[1] = (this.segment_divs.length - 1);
		}else{
			for(var i = current_div_iteration; i < this.segment_divs.length; i++){
				var current_div_pos = Position.cumulativeOffset($(this.segment_divs[i]));
				var current_div_bottom = current_div_pos[1] + $(this.segment_divs[i]).getHeight();
				if((max >= current_div_pos[1] && max <= current_div_bottom)){
					//console.log("Section "+i+" is in the current view");
					return_array[1] = i;
					current_div_iteration = i;
					break;
				}
			}
		}
		
		return return_array;
	}
}

// ===============
// = PopUP Class =
// ===============
//
//
if(!Control) var Control = {};
Control.LoadingReminder = Class.create();

Control.LoadingReminder.prototype = {
	initialize: function (reminder_elem_id ,position,options){
		this.reminder_elem_id = reminder_elem_id;
		this.position = position;
		this.fade_effect = "";
		this.fading = false;
		
		// We have a lot of defaults that we use if not defined
		this.options = Object.extend({
			effects : 'on'
		}, options || {});
		
		// Do some fun stuff on the div provided
		if(typeof document.body.style.maxHeight != "undefined"){		// filter out the rancid IE 6
			var pop_pos = 'fixed';
		}else{
			var pop_pos = 'absolute';
		}
		if (this.position == 'left') $(this.reminder_elem_id).setStyle({ position: pop_pos, display: 'none', top : '0px', left : '0px' });
		if (this.position == 'right') $(this.reminder_elem_id).setStyle({ position: pop_pos, display: 'none', top : '0px', right : '0px' });
		if (this.position == 'bottom') $(this.reminder_elem_id).setStyle({ position: pop_pos, display: 'none', bottom : '0px', left : '0px' });
		
		//not sure what this is for may need to ask clark e but left in it cause errors with widget fixed header
		//Event.observe($(this.reminder_elem_id), 'mousedown', this.popup_elem_event);
		
		// IE 6 support, now it gets ugly
		if(typeof document.body.style.maxHeight == "undefined"){
			Event.observe(window, 'scroll', this.ieScroll.bind(this));
		}		
	}, 
	show : function(){
		if(this.fading){
			this.fade_effect.cancel();
			this.fading = false;
		}
		$(this.reminder_elem_id).setStyle({ display: 'block', opacity: "1", filter : "alpha(opacity=100)" });
		
		
	},
	hide : function(){
		if(this.options.effects == 'on'){
			this.fade_effect = Effect.Fade(this.reminder_elem_id, { duration : 1.5, afterFinish :  this.afterHide.bind(this) });
			this.fading = true;
		}else{
			$(this.reminder_elem_id).setStyle({ display: 'none'  });
		}
		
		
	},
	afterHide : function(){
		this.fading = false;
	},
	ieScroll : function(){
		var scrolled = document.viewport.getScrollOffsets();
		var winHeight = document.viewport.getHeight();
		if (this.position == 'bottom') $(this.reminder_elem_id).setStyle({ top: winHeight+'px'});
		else $(this.reminder_elem_id).setStyle({ top : scrolled[1]+'px'});
	},
	isVisible : function(){
		if($(this.reminder_elem_id).getStyle('display') == 'block'){
			return true;
		}else{
			return false;
		}
	}
}