<?php

?>

<div id="login" class="box" style="display:none">
    <img id="close" src="images/close.gif" onclick="hideBox('login')" alt="Close" 
         title="Close this window" />
         
	<h2>Log in</h2>
	<p id="userloginlink">Don't have a login? <a href="<?= $this->config->site_url();?>/create_account/">Create an account</a>.</p>
	<div id="userloginprompt"><p>You must have cookies enabled to log in to Politic 2.0.</p></div>
	
	<?= form_open('user/login'); ?>
	<?= form_format("Username: ",form_input('user_name','','class="txt"') ); ?>
	<?= form_format("Password: ",form_password('user_password','','class="txt"') ); ?>
	<br /><?= form_submit('','Login'); ?>
	<?= form_close(); ?>
	
	<br /><br />
	<?= form_open('user/loginOpenID'); ?>
	<?= form_format("OpenID Login: ",form_input('openid_url','','class="txt"') ); ?>
	<?= form_hidden('openid_action','login'); ?>
	<br /><?= form_submit('','Login'); ?>
	<?= form_close(); ?>
	<div><a href="http://www.myopenid.com/" class="link" target='_top'>Get an OpenID</a></div>

	
         
</div>
