<h3>Candidate Dashboard</h3>
<div>Current Question: <?=$questions[0]['question_name']?></div>
<div>Question Timer: <?=$timerHTML?></div>
<div>Local Time: <span id="clock">&nbsp;</span></div>
<script language="JavaScript">updateClock(); setInterval('updateClock()', 1000 );</script>
<? if($this->userauth->isAdmin()): ?>
<div>
	<p><?= form_open("conventionnext/restart_question_timer/$event_name") ?>
	<?= form_submit('', 'Reset Timer') ?>
	<?= form_close() ?>
	</p>
</div>
<? endif; ?>