
<div class="news-summary" id="xnews-5">
	<!-- raiting topics start here -->
	<div class="raiting" >
		<span id="xvote-5" class="next_invisible">
			<a href="index.php/question/voteup/<?= $question_id; ?>" class="up">up</a>	
		</span>
		<span id="xreport-<?= $question_id; ?>">
			<a href="index.php/question/votedown/<?= $question_id; ?>" class="down">down</a>
		</span>
		<a id="xvotes-<?= $question_id; ?>" href="index.php/votes/who/<?= $question_id; ?>" class="vote_digit"><?=(is_numeric($votes))?$votes:0;?></a>
	</div>
																					
	<div class="describtion">
		<div class="describtion-frame">
			<div class="descr-tr">
				<div class="descr-bl">
					<div class="descr-br">
						<h3><a href="index.php/question/queue/event/<?= url_title($question_name); ?>"><?=$question_name;?></a></h3>
						<div class="autor">
							<p>Posted by: <a href="/user/profile/<?=$user_name;?>"><?=$user_name;?></a> <!-- 72 days ago -->
								<span id="ls_story_link-<?= $question_id; ?>"></span>
							</p>
							<p>
								Event: <a href="index.php/event"><?=$event_name;?></a><span id="ls_adminlinks-5" style="display:none"></span>
							</p>
						</div>
						<p><?=$question_desc;?><a href="index.php/question/queue/event/<?= url_title($question_name); ?>" class="more"> read more &raquo;</a></p>
						<ul class="options">
							<li class="discuss"><a href="index.php/question/queue/event/<?= url_title($question_name); ?>">Discuss</a></li> 	
							<li class="tell-friend" id="ls_recommend-5"><a href="javascript://" onclick="show_recommend(5, 58, '<?= $this->config->site_url();?>');">Tell a friend</a></li>
						</ul>
						<span id="emailto-5" style="display:none"></span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>