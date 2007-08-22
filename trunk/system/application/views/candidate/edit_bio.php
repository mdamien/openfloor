<?php
$can_password_attrs = array(			'name' => 'can_password',
										'value' => '',
										'class' => 'txt',
										'maxlength' => 45);
$can_bio_attrs = array(					'name' => 'can_bio',
										'value' => $this->validation->can_bio,
										'class' => 'txt',
										'rows' => '3',
						            	'cols' => '48');										
?>

<? $this->load->view('view_includes/header.php');?>
<div id="content_div">	
  <h2>Edit Candidate Biography</h2>	
  	<div class='errorArea'><?=$error;?></div>
		<?= form_open("conventionnext/edit/bio/$can_name", null, array('can_id' => $can_id, 'submitted' => 'true')) ?>
		<?= form_format('Biography: ', form_textarea($can_bio_attrs)) ?>
		<?= form_format('Candidate password: ', form_password($can_password_attrs)) ?>
		<p><?= form_submit(null, 'Edit', 'class="button"') ?></p>
		<?= form_close() ?>
</div>
<? $this->load->view('view_includes/footer.php'); ?>
