<? if(isset($current_question_flag) && empty($current_question)): ?>	
	&nbsp;<strong>There is no current question</strong>
<? else: ?>
	<? 	
	if(isset($current_question_flag)) $question = $current_question;
	$count = 0; 	// Used for IE 6 hack
	foreach($questions as $question): 
		$votes = ($question['votes'] == 1) ? 'vote ' : 'votes' ; 
		# IE 6 has this nasty bug where if I don't insert this section below, the first pod for every return will not have it's background applied
		if(($this->agent->browser() == "Internet Explorer" && $this->agent->version() < 7) && $count == 0): ?>
			<div style="overflow: hidden; height: 0px; margin-top: -22px"></div>
		<? endif; ?>
		
		<div>
		  <b class="qpod">
		  <b class="qpod1"><b></b></b>
		  <b class="qpod2"><b></b></b>
		  <b class="qpod3"></b>
		  <b class="qpod4"></b>
		  <b class="qpod5"></b></b>
				  
			<div class="<?= isset($current_question_flag) ? 'current-question-pod' : 'question-pod-container' ?>" id="question_container_<?= $question['question_id'] ?>">
			  <div class="question-podfg">
				<table cellpadding="0" cellspacing="0" style="margin-top: 5px; margin-bottom: 5px;">
					<tr>
						<?if(!isset($current_question_flag)):?>
							<td style="padding-left: 5px;"><div class="score" title='Question Score'><?= $question['votes'] ?></div></td>
							<? if($question['question_status'] != 'asked' && !$event_data["event_finished"] && !$is_respondent):?>
								<td><div class="vote"><? $this->load->view('user/_cp_vote_box', $question) ?></div></td>
							<? endif; ?>
						<?else:?>
							<td><div class="flag"><!-- <img src="./images/flag.png"> --></div></td>
						<?endif;?>
						<td width="100%">
							<div class="question"<?= isset($current_question_flag) ? ' id="the-current-question"' : '' ?>>
								<?/*<a href="<?= $this->config->site_url();?>/user/profile/<?=$question['user_name'];?>">*/?>
									<a href="javascript:showUrl('/user/profile/<?=$question['user_name'];?>/true');">
									<img class="sc_image" src="./avatars/shrink.php?img=<?=$question['avatar_path'];?>&w=16&h=16">
								</a>&nbsp;
								<?= $question['question_name'] ?>
							</div>
						</td>
						<td><div class="flag"><!-- <img src="./images/flag.png"> --></div></td>
					</tr>
				</table>
				<div id="cp_tab_body_<?= $question['question_id'] ?>" class="cp-comments" style="display:none;overflow:auto;"></div>	
			  </div>
			</div>
		
		  <b class="qpod">
		  <b class="qpod5"></b>
		  <b class="qpod4"></b>
		  <b class="qpod3"></b>
		  <b class="qpod2"><b></b></b>
		  <b class="qpod1"><b></b></b></b>
		</div>
		<div id="tabs_container">
		<!-- TABS -->
		<div id="cp_votes_tab_<?= $question['question_id'] ?>" class="votes" title="Vote History" onClick="cpUpdater.view_tab_section('votes',<?= $question['question_id'] ?>)"><?= $question['vote_count'] ?> votes</div>
		<div id="cp_comments_tab_<?= $question['question_id'] ?>" class="comments" title="Comments" onClick="cpUpdater.view_tab_section('comments', <?= $question['question_id'] ?>, event_name, '<?= url_title($question['question_name']) ?>', this)"><?= $question['comment_count'] ?> comments</div>
		<div id="cp_info_tab_<?= $question['question_id'] ?>" class="info" title="More Info" onClick="cpUpdater.view_tab_section('info', '<?= $question['question_id'] ?>')">more info</div>
		<? if($question['question_answer']): ?>
			<div id="cp_answer_tab_<?= $question['question_id'] ?>" class="answer" title="Answer" onClick="cpUpdater.view_tab_section('answer','<?= $question['question_id'] ?>');">Answer</div>
		<? endif; ?>
		<? if($this->userauth->isEventAdmin($event_id)): ?>
			<div id="cp_admin_tab_<?= $question['question_id'] ?>" class="admin" title="Admin" onClick="cpUpdater.view_tab_section('admin','<?= $question['question_id'] ?>', <?=$event_id?>);">Admin</div>
			<? if($this->config->item('custom_deleted_tab') && !$question['question_answer'] && ($question['question_status']!='deleted') ){ ?>
				<div id="cp_delete_tab_<?= $question['question_id'] ?>" class="admin" title="Delete" onclick="cpUpdater.deleteQuestion(<?=$question['question_id']?>);">Delete</div>
			<? } ?>
		<? endif; ?>
		
		<div id="cp_flag_tab_<?= $question['question_id'] ?>" class="comments" title="Flag This" onClick="cpUpdater.view_tab_section('flag','<?= $question['question_id'] ?>');" >
			flag This
		</div>
		<?$this->load->view("ajax/question_flag",$data);?>
		<div style="clear:both;"></div>
		<? $count++; ?>
		</div>
	<? 	endforeach; ?>
	<?
	//lets make sure we are showing something
	
	if ($count === 0) {
	?>
		<div class="empty_que">
			<h3>There are no Questions Here.</h3>
			<strong>Either they have all been answered or we are waiting for you to ask one.</strong>
		</div>
	<? } ?>
<? endif; ?>