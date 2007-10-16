<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<base href="<?= $this->config->site_url();?>" />
	<title>RunPolitics Dashboard</title>
	<link rel="stylesheet" type="text/css" href="css/all.css" />
	<link rel="stylesheet" type="text/css" href="css/ucp.css" />
	<link rel="stylesheet" type="text/css" href="css/userWindow.css" />
	<script type="text/javascript" src="javascript/lib/prototype.js"></script>
	<script src="javascript/src/scriptaculous.js" type="text/javascript"></script>
	<script src="javascript/userWindow.js" type="text/javascript"></script>
	<script type="text/javascript">
	ajaxOn = true;
	site_url = '<?= $this->config->site_url();?>';
	var event_name = '<?=$event?>';
	var cans = [<? $cans = ''; foreach($candidates as $v) $cans .= "'{$v['can_id']}', "; echo substr($cans, 0, -2); ?>];	
	var sort = 'pending';
	</script>

	<script type="text/javascript" src="javascript/cpUpdater.js"></script>
	<script type="text/javascript">cpUpdater.cpUpdate();</script>
	<style type="text/css" media="screen" >
		/* put the left rounded edge on the track */
		.track-left {
			position: absolute;
			width: 5px;
			height: 9px;
			background: transparent url(./images/slider-images-track-left.png) no-repeat top left;
		}

		/* put the track and the right rounded edge on the track */
		.track {
			background: transparent url(./images/slider-images-track-right.png) no-repeat top right;
		}
	</style>
</head>
<body>		
	<!-- This reimplements the stuff that is normally loaded for each page on the rest of the site.  Used for the disclaimer dialog -->
	<div id="overlay" onclick="hideBox()" style="display:none"></div>
	<div id="hijax" style="display:none" class="ajax_box"></div>
	
	<div id="ucp">
		<h1>Dashboard</h1>
		<div class="hr-1"></div>
		<div class="section">
			<span class="section-title">Current Question:</span>
			<!-- <img class="content-toggle" src="./images/ucp/toggle.jpg" onClick="javascript:new Effect.toggle('current_question','blind', {queue: 'end'});"/> -->
		</div>
	
		<div id="current_question">
		<? $this->load->view('user/cp_current_question'); ?>
		</div>		  

		<table class="feed-reaction-panel">
			<tr>
				<td>
					<div class="section">
						<span class="section-title">Live Video Feed:</span>
						<!-- <img class="content-toggle" src="./images/ucp/toggle.jpg" onClick="javascript:new Effect.toggle('video_container','blind', {queue: 'end'});"/> -->
					</div>
					<div id="video_container">
						<?= $stream_high ?>
						<!-- <img src="./images/ucp/video-placeholder.jpg"/> -->
					</div>
				</td>
				<td>
					<div class="section">
						<span class="section-title">Participant Reaction:</span>
						<!-- <img class="content-toggle" src="./images/ucp/toggle.jpg" onClick="javascript:new Effect.toggle('user-reaction','blind', {queue: 'end'});"/> -->
					</div>
					<div id="user-reaction">
						Rate the credibility of each candidate's response for each question.
					<? $this->load->view('user/_cp_user_reaction'); ?>
					</div>
					<div id="user-reaction-ajax"></div>
					<br/><br/>
					<img src="./images/ucp/ask-a-question.jpg" onClick="javascript:new Effect.toggle('cp-ask-question','blind', {queue: 'end'});"/>
				</td>
			</tr>
		</table>
		<div id="cp-ask-question" style="display:none"><? $this->load->view('question/_submit_question_form') ?></div>
		<div class="section">
			<span class="section-title">Upcoming Questions</span>
			<span style="float:right;padding-top:3px;cursor:pointer;">
				<span class="link" onClick="sort='pending';cpUpdater.updaters=null;cpUpdater.cpUpdate();">Upcoming</span> | 
				<span class="link" onClick="sort='newest';cpUpdater.updaters=null;cpUpdater.cpUpdate();">Newest</span> | 
				<span class="link" onClick="sort='asked';cpUpdater.updaters=null;cpUpdater.cpUpdate();">Asked</span>&nbsp;&nbsp;
			</span>
			<!-- <img class="content-toggle" src="./images/ucp/toggle.jpg" onClick="javascript:new Effect.toggle('upcoming_questions','blind', {queue: 'end'});"/> -->
		</div>
		<div id="upcoming_questions">		
			<? $this->load->view('user/cp_upcoming_questions') ?>
		</div>	
	</div>	
</body>
</html>