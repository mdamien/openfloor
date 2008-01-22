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
cpUpdater.current_question_last_value = false;
cpUpdater.current_question_id = 0;
cpUpdater.current_tab_name = false;
cpUpdater.sliders = new Object;
ajaxOn = true;
var sort = 'pending';

cpUpdater.cpUpdateOnce = function() {
	new Ajax.Updater('current_question', site_url + 'forums/cp/' + event_name + '/current_question');
}

cpUpdater.vote = function(url) {
	my_loading_reminder.show();
	new Ajax.Request(url, {
		onSuccess: function(transport) {
			my_loading_reminder.hide();
			cpUpdater.cpUpdateOnce();
			lazy_loader.refreshView();
		}
	});
}

cpUpdater.cpUpdate = function(stream_update) {
	updaters = new Array();
	if(stream_update){
		// Changes the overall reaction field
		for(var i = 0; i < cans.length; i++){
			cpUpdater.ajaxReaction(cans[i]);  // Initial call
			cpUpdater.reaction_updater_id[i] = setInterval('cpUpdater.ajaxReaction('+cans[i]+')', 10000);
		}
		
		// Switches the current question when necessary
		cpUpdater.ajaxCurrentQuestion();
		cpUpdater.current_question_updater_id = setInterval('cpUpdater.ajaxCurrentQuestion()', 10000);
	}
	
}

// Used above as part of the interval call
cpUpdater.ajaxReaction = function(speaker_id){
	new Ajax.Request(site_url + 'forums/ajax_get_overall_response/'+ event_name +'/'+speaker_id, {
	  onSuccess: function(transport) {
		//alert(transport.responseText);
		
		$('overall-reaction-meter-'+speaker_id).setStyle(
			{
				width: transport.responseText
			}
		);
	  }
	});
}

// Used above as part of the interval call, this checks to see if there is a new question, and will only show the new question if there is.  
// This is done for efficiency.
cpUpdater.ajaxCurrentQuestion = function(speaker_id){
	new Ajax.Request(site_url + 'forums/ajax_get_current_question/'+ event_name, {
		onSuccess: function(transport) {
			if(transport.responseText != cpUpdater.current_question_last_value){
				cpUpdater.ajaxUpdateCurrentQuestion();
				cpUpdater.current_question_last_value = transport.responseText;
			}
	  	}
	});
}
// used with the above function, it will actually display the new current question
cpUpdater.ajaxUpdateCurrentQuestion = function(){
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
			}
		}
	});
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
},
cpUpdater.change_comments_sort = function(question_id, event_name, question_name, sort) {
	my_loading_reminder.show();
	new Ajax.Updater('cp-comments-' + question_id, site_url + 'question/view/' + event_name + '/' + question_name + '/' + sort, {
		parameters: {
			'ajax' : 'true'
		},
		onSuccess: function(transport) {
			my_loading_reminder.hide();
		}
	});
}

cpUpdater.voteComment = function (url, question_id, event_name, question_name) {
	new Ajax.Request(url, {
		onSuccess: function(transport) {
			new Ajax.Updater('cp-comments-' + question_id, site_url + 'question/view/' + event_name + '/' + question_name, {
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
			new Ajax.Updater('cp-comments-' + question_id, site_url + 'question/view/' + event_name + '/' + question_name, {
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
		if($('sort-link-' + s).hasClassName('cp-sort-link-selected')) {
			$('sort-link-' + s).removeClassName('cp-sort-link-selected');
			$('sort-link-' + s).addClassName('cp-sort-link');
		}
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
		
		// Change the highlights
		if(event_timing == 'past'){
			sort_links = ['pending', 'asked'];
		}else{
			sort_links = ['pending', 'newest', 'asked'];
		}

		sort_links.each(function(s){
			if( $('sort-link-'+ s + '-2').hasClassName('cp-sort-link-selected') ){
				setTimeout("cpUpdater.change_sort('"+s+"')",  1500);
			}
		});
	}else{
		$('question_error_div').innerHTML = "Could not update!";
	}
	
}